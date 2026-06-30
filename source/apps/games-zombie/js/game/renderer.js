import { CONFIG, depthScale, depthY } from './config.js';

/**
 * 集中處理所有 Canvas 繪製。
 * Renderer 只讀取遊戲狀態，不修改關卡與戰鬥規則，方便將視覺與玩法分開理解。
 */
export class GameRenderer {
  /** 保存 Canvas、素材與攝影機服務，並建立選單待機用的殭屍清單。 */
  constructor(canvas, assets, motionTracker) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.assets = assets;
    this.motionTracker = motionTracker;
    this.attractZombies = [];
  }

  /**
   * 依舞台大小及裝置像素比調整 Canvas；邏輯座標仍維持 CSS 像素，避免高 DPI 影響判定。
   */
  resize(stage) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = stage.clientWidth || window.innerWidth;
    const height = stage.clientHeight || window.innerHeight;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width, height };
  }

  /**
   * 遊戲中的完整繪製管線：背景 → 攝影機 → 景深物件 → 特效 → 警告 → HUD。
   */
  render(game) {
    const ctx = this.context;
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.save();
    if (game.shake > 0) {
      ctx.translate((Math.random() - 0.5) * 16 * game.shake, (Math.random() - 0.5) * 16 * game.shake);
    }

    this.drawBackground(game);
    if (game.showCamera && this.motionTracker.ready && game.inputMode === 'camera') {
      ctx.save();
      ctx.globalAlpha = 0.2;
      this.motionTracker.drawCamera(ctx, game.width, game.height);
      ctx.restore();
    }
    if (game.showMotion && game.inputMode === 'camera') this.drawMotionGlow(game);

    const depthOrder = [
      ...game.zombies.map((zombie) => ({ progress: zombie.progress, zombie })),
      ...game.bombs.map((bomb) => ({ progress: bomb.progress, bomb })),
    ].sort((a, b) => a.progress - b.progress);
    depthOrder.forEach((item) => item.zombie ? this.drawZombie(game, item.zombie) : this.drawBomb(game, item.bomb));
    game.particles.forEach((particle) => this.drawParticle(game, particle));

    ctx.textAlign = 'center';
    ctx.font = `900 ${Math.round(game.height * 0.04)}px sans-serif`;
    for (const popup of game.popups) {
      const alpha = 1 - popup.time / 0.9;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = popup.combo > 1 ? '#ffd93b' : '#8dff5a';
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(0,40,0,.65)';
      ctx.strokeText(popup.text, popup.x, popup.y);
      ctx.fillText(popup.text, popup.x, popup.y);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    if (game.state === 'playing' && game.dangerNow) this.drawDangerBorder(game);
    if (game.state === 'playing' && game.freezeTime > 0) this.drawFreeze(game);
    this.drawHud(game);
  }

  /** 選單背景動畫：維持少量殭屍從遠處走近，離開畫面後自動回收。 */
  renderAttract(game, deltaTime) {
    const ctx = this.context;
    ctx.clearRect(0, 0, game.width, game.height);
    this.drawBackground(game);
    if (!this.assets.isLoaded(this.assets.get('normal0'))) return;

    if (this.attractZombies.length < 6) {
      const kinds = ['normal', 'club', 'bucket', 'tiny', 'normal', 'dancer'];
      const zombie = game.makeZombie(kinds[(Math.random() * kinds.length) | 0], {
        fx: game.width * (0.08 + 0.84 * Math.random()),
      });
      zombie.progress = Math.random() * 0.25;
      zombie.speed = 0.05 + Math.random() * 0.03;
      this.attractZombies.push(zombie);
    }

    for (const zombie of this.attractZombies) {
      zombie.progress += zombie.speed * deltaTime * 0.7;
      zombie.bob += deltaTime * 7;
      zombie.wob += deltaTime * 4.5;
    }
    this.attractZombies = this.attractZombies.filter((zombie) => zombie.progress < 1.05);
    this.attractZombies.sort((a, b) => a.progress - b.progress);
    this.attractZombies.forEach((zombie) => this.drawZombie(game, zombie));
  }

  /** 繪製鬼屋背景；素材未載入時以漸層草地替代。 */
  drawBackground(game) {
    const image = this.assets.get('background');
    if (this.assets.isLoaded(image)) {
      this.drawCover(image, game.width, game.height);
      return;
    }
    const gradient = this.context.createLinearGradient(0, 0, 0, game.height);
    gradient.addColorStop(0, '#23203a');
    gradient.addColorStop(CONFIG.horizon, '#3a3550');
    gradient.addColorStop(CONFIG.horizon + 0.001, '#4a5a3a');
    gradient.addColorStop(1, '#2e3b24');
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, game.width, game.height);
  }

  /** 將來源圖片等比例 cover 到指定區域，超出的左右或上下部分會被裁切。 */
  drawCover(source, targetWidth, targetHeight) {
    const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
    const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
    if (!sourceWidth || !sourceHeight) return;
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = targetWidth / targetHeight;
    let width;
    let height;
    let x;
    let y;
    if (sourceRatio > targetRatio) {
      height = targetHeight;
      width = targetHeight * sourceRatio;
      x = (targetWidth - width) / 2;
      y = 0;
    } else {
      width = targetWidth;
      height = targetWidth / sourceRatio;
      x = 0;
      y = (targetHeight - height) / 2;
    }
    this.context.drawImage(source, x, y, width, height);
  }

  /** 把影格差分遮罩畫成淡黃色格點，協助現場校正動作偵測。 */
  drawMotionGlow(game) {
    const ctx = this.context;
    const cellWidth = game.width / CONFIG.processWidth;
    const cellHeight = game.height / CONFIG.processHeight;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,236,120,0.06)';
    for (let y = 0; y < CONFIG.processHeight; y += 1) {
      for (let x = 0; x < CONFIG.processWidth; x += 1) {
        if (this.motionTracker.motion[y * CONFIG.processWidth + x]) {
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
        }
      }
    }
    ctx.restore();
  }

  /**
   * 依景深、角色狀態與動作計算尺寸、搖晃、死亡淡出，並加上小頭目血條或頭目護盾。
   */
  drawZombie(game, zombie) {
    const ctx = this.context;
    const height = depthScale(zombie.progress, game.height) * zombie.sizeMultiplier;
    const image = this.assets.imageForZombie(zombie);
    const x = zombie.fx;
    const floorY = depthY(zombie.progress, game.height);
    let rotation = 0;
    let bobY = 0;
    let scale = 1;
    let alpha = zombie.state !== 'dead' && zombie.progress < 0.1 ? Math.max(0, zombie.progress / 0.1) : 1;

    if (zombie.dancer && zombie.dancing) {
      rotation = Math.sin(zombie.bob * 3.2) * 0.2;
      bobY = -Math.abs(Math.sin(zombie.bob * 3.2)) * height * 0.06;
      scale = 1 + Math.sin(zombie.bob * 6) * 0.03;
    } else if (zombie.state === 'walk') {
      rotation = Math.sin(zombie.wob) * 0.05;
      bobY = -Math.abs(Math.sin(zombie.bob)) * height * 0.03;
    } else if (zombie.state === 'attack') {
      const lunge = Math.max(0, zombie.lungeTime / 0.28);
      rotation = Math.sin(zombie.bob * 2) * 0.03 + lunge * 0.3 * zombie.swingDirection;
      bobY = lunge * height * 0.03;
      scale = 1 + lunge * 0.1;
    } else if (zombie.state === 'dead') {
      const death = Math.min(1, zombie.deadTime / CONFIG.deathDuration);
      alpha *= 1 - death;
      rotation = death * 0.6;
      bobY = death * height * 0.12;
      scale = 1 - death * 0.25;
    }

    if (zombie.summoned && zombie.state !== 'dead') this.drawSummonHalo(game, x, floorY, height);
    const flipX = zombie.dancer && zombie.dancing && Math.floor(zombie.wob * 1.2) % 2 !== 0 ? -1 : 1;

    ctx.save();
    ctx.translate(x, floorY + bobY);
    ctx.globalAlpha = alpha;
    ctx.rotate(rotation);
    ctx.scale(scale * flipX, scale);
    if (!this.assets.isLoaded(image)) {
      ctx.fillStyle = '#6cae4a';
      ctx.beginPath();
      ctx.ellipse(0, -height * 0.5, height * 0.3, height * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const width = height * image.naturalWidth / image.naturalHeight;
      if (zombie.flash > 0) ctx.filter = 'brightness(1.9)';
      ctx.drawImage(image, -width / 2, -height, width, height);
    }
    ctx.restore();

    if (zombie.miniBoss && zombie.state !== 'dead' && zombie.maxHp > 1) {
      const width = height * 0.62;
      const x0 = x - width / 2;
      const y0 = floorY - height - game.height * 0.018;
      const barHeight = game.height * 0.012;
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      this.roundedRect(x0 - 2, y0 - 2, width + 4, barHeight + 4, barHeight);
      ctx.fill();
      ctx.fillStyle = '#3a0d0d';
      this.roundedRect(x0, y0, width, barHeight, barHeight);
      ctx.fill();
      ctx.fillStyle = '#ff7a3d';
      this.roundedRect(x0, y0, width * Math.max(0, zombie.hp) / zombie.maxHp, barHeight, barHeight);
      ctx.fill();
    }

    if (zombie.boss && zombie.state !== 'dead' && game.level >= 3 && game.bossShielded) {
      const centerY = floorY - height * 0.5;
      const radiusY = height * 0.6;
      ctx.save();
      ctx.globalAlpha = 0.4 + 0.15 * Math.sin(zombie.bob * 4);
      ctx.strokeStyle = '#7fd0ff';
      ctx.lineWidth = Math.max(3, game.height * 0.006);
      ctx.beginPath();
      ctx.ellipse(x, centerY, radiusY * 0.72, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(120,200,255,0.12)';
      ctx.fill();
      ctx.restore();
    }
  }

  /** 在跳舞殭屍召喚出的怪物腳下繪製脈動紫色光環。 */
  drawSummonHalo(game, x, y, height) {
    const ctx = this.context;
    const pulse = 0.5 + 0.5 * Math.sin(game.elapsed * 5 + x * 0.02);
    const radiusX = height * 0.42 * (1 + 0.08 * pulse);
    const radiusY = radiusX * 0.34;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = 'lighter';
    const gradient = ctx.createRadialGradient(0, 0, radiusY * 0.2, 0, 0, radiusX);
    gradient.addColorStop(0, `rgba(225,140,255,${0.3 + 0.22 * pulse})`);
    gradient.addColorStop(0.6, `rgba(180,80,255,${0.15 + 0.1 * pulse})`);
    gradient.addColorStop(1, 'rgba(150,60,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, height * 0.022);
    ctx.strokeStyle = `rgba(240,180,255,${0.45 + 0.35 * pulse})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX * 0.82, radiusY * 0.82, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /** 繪製帶紅色脈動底光的炸彈桶；素材失敗時使用簡單方塊。 */
  drawBomb(game, bomb) {
    const ctx = this.context;
    const height = depthScale(bomb.progress, game.height) * 0.8;
    const x = bomb.fx;
    const y = depthY(bomb.progress, game.height);
    const pulse = 0.5 + 0.5 * Math.sin(bomb.time * 9);
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.3 * pulse;
    ctx.fillStyle = '#ff5a1e';
    ctx.beginPath();
    ctx.ellipse(x, y - height * 0.35, height * 0.5 * (1 + pulse * 0.12), height * 0.22 * (1 + pulse * 0.12), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const image = this.assets.get('bomb');
    if (this.assets.isLoaded(image)) {
      const width = height * image.naturalWidth / image.naturalHeight;
      ctx.drawImage(image, x - width / 2, y - height, width, height);
    } else {
      ctx.fillStyle = '#333';
      ctx.fillRect(x - height * 0.22, y - height * 0.6, height * 0.44, height * 0.6);
    }
  }

  /** 依粒子種類繪製揮擊弧線、裂痕、星形或圓形碎片。 */
  drawParticle(game, particle) {
    const ctx = this.context;
    if (particle.swipe) {
      const alpha = Math.max(0, 1 - particle.time / particle.life);
      const progress = particle.time / particle.life;
      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      ctx.translate(particle.x, particle.y);
      ctx.strokeStyle = 'rgba(255,255,255,.95)';
      ctx.lineWidth = Math.max(3, particle.size * 0.12);
      ctx.lineCap = 'round';
      const radius = particle.size * (0.5 + progress * 0.7);
      const base = particle.direction > 0 ? -0.6 : Math.PI + 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, radius, base, base + 1.7 * (particle.direction > 0 ? 1 : -1));
      ctx.stroke();
      ctx.restore();
      return;
    }

    const alpha = 1 - particle.time / particle.life;
    if (particle.crack) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      ctx.translate(particle.x, particle.y);
      ctx.strokeStyle = 'rgba(255,255,255,.95)';
      ctx.lineWidth = Math.max(2, game.height * 0.004);
      const radius = particle.size * (0.4 + particle.time / particle.life * 0.8);
      for (let index = 0; index < 8; index += 1) {
        const angle = index / 8 * Math.PI * 2 + index;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(particle.x, particle.y);
    ctx.fillStyle = particle.color;
    if (particle.star) {
      ctx.rotate(particle.time * 8);
      this.star(0, 0, particle.size, particle.size * 0.45, 5);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }

  /** 有敵人接近攻擊距離時，繪製隨時間脈動的橘色警告框。 */
  drawDangerBorder(game) {
    const ctx = this.context;
    const alpha = 0.28 + 0.3 * Math.abs(Math.sin(performance.now() * 0.009));
    const width = Math.max(6, Math.round(game.height * 0.018));
    ctx.save();
    ctx.lineWidth = width;
    ctx.strokeStyle = `rgba(255,120,0,${alpha.toFixed(3)})`;
    ctx.strokeRect(width / 2, width / 2, game.width - width, game.height - width);
    ctx.restore();
  }

  /** 瀕死救援期間覆蓋冰藍濾鏡，並在中央顯示剩餘秒數。 */
  drawFreeze(game) {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = 'rgba(120,200,255,0.18)';
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = Math.max(4, Math.round(game.height * 0.012));
    ctx.strokeStyle = 'rgba(8,40,80,.85)';
    ctx.font = `800 ${Math.round(game.height * 0.052)}px sans-serif`;
    ctx.fillStyle = '#cfeaff';
    ctx.strokeText('❄ 全場冰凍', game.width / 2, game.height * 0.31);
    ctx.fillText('❄ 全場冰凍', game.width / 2, game.height * 0.31);
    ctx.font = `900 ${Math.round(game.height * 0.2)}px sans-serif`;
    ctx.fillStyle = '#e8f6ff';
    ctx.strokeText(Math.ceil(game.freezeTime), game.width / 2, game.height * 0.5);
    ctx.fillText(Math.ceil(game.freezeTime), game.width / 2, game.height * 0.5);
    ctx.restore();
  }

  /** 繪製關卡、分數、擊殺、計時、生命、連擊、橫幅與受傷閃光。 */
  drawHud(game) {
    const ctx = this.context;
    const padding = game.height * 0.028;
    const fontSize = Math.round(game.height * 0.045);
    ctx.textAlign = 'left';
    ctx.font = `900 ${fontSize}px sans-serif`;
    ctx.fillStyle = 'rgba(0,0,0,.32)';
    this.roundedRect(padding * 0.6, padding * 0.6, fontSize * 5.4, fontSize * 2.6, 14);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(`第 ${game.level} 關`, padding, padding * 0.6 + fontSize);
    ctx.fillStyle = '#ffd93b';
    ctx.font = `900 ${Math.round(fontSize * 0.82)}px sans-serif`;
    ctx.fillText(`${game.score} 分`, padding, padding * 0.6 + fontSize * 2.15);

    ctx.textAlign = 'right';
    ctx.font = `900 ${fontSize}px sans-serif`;
    ctx.fillStyle = 'rgba(0,0,0,.32)';
    this.roundedRect(game.width - padding * 0.6 - fontSize * 3.6, padding * 0.6, fontSize * 3, fontSize * 1.4, 14);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(`💀 ${game.kills}`, game.width - padding, padding * 0.6 + fontSize);

    ctx.textAlign = 'center';
    ctx.font = `900 ${fontSize}px sans-serif`;
    let timerText;
    if (game.gameMode === 'timed') {
      const minutes = Math.floor(game.timeLeft / 60);
      const seconds = Math.floor(game.timeLeft % 60);
      ctx.fillStyle = game.timeLeft <= 15 ? '#ff6b6b' : '#fff';
      timerText = `⏱ ${minutes}:${String(seconds).padStart(2, '0')}`;
    } else {
      const minutes = Math.floor(game.elapsed / 60);
      const seconds = Math.floor(game.elapsed % 60);
      ctx.fillStyle = '#ffd93b';
      timerText = `♾ ${minutes}:${String(seconds).padStart(2, '0')}`;
    }
    ctx.fillText(timerText, game.width * 0.5, padding * 0.6 + fontSize);

    const heartRadius = Math.round(game.height * 0.023);
    const heartGap = heartRadius * 2.7;
    const heartSize = heartRadius * 2;
    const heartY = padding * 0.6 + fontSize + heartSize * 0.78;
    const startX = game.width * 0.5 - (CONFIG.baseHp - 1) * heartGap / 2;
    for (let index = 0; index < CONFIG.baseHp; index += 1) {
      this.drawHeart(startX + index * heartGap, heartY, heartRadius, Math.min(1, Math.max(0, game.hp - index)));
    }

    if (game.boss && game.boss.state !== 'dead') this.drawBossBar(game, heartY, heartSize);
    if (game.combo > 1 && game.comboTimer > 0) {
      ctx.textAlign = 'center';
      ctx.font = `900 ${Math.round(game.height * 0.05)}px sans-serif`;
      ctx.fillStyle = '#ffcf33';
      ctx.fillText(`${game.combo} COMBO!`, game.width * 0.5, game.height * 0.34);
    }
    if (game.banner) this.drawBanner(game);
    if (game.hurtFlash > 0) {
      ctx.fillStyle = `rgba(220,0,0,${0.35 * game.hurtFlash / 0.45})`;
      ctx.fillRect(0, 0, game.width, game.height);
    }
  }

  /** 繪製主頭目血條；護盾啟用時同時提示剩餘小怪數量。 */
  drawBossBar(game, heartY, heartSize) {
    const ctx = this.context;
    const width = game.width * 0.46;
    const height = game.height * 0.024;
    const x = game.width * 0.5 - width / 2;
    const y = heartY + heartSize * 0.4;
    ctx.fillStyle = 'rgba(0,0,0,.5)';
    this.roundedRect(x - 4, y - 4, width + 8, height + 8, height);
    ctx.fill();
    ctx.fillStyle = '#3a0d0d';
    this.roundedRect(x, y, width, height, height);
    ctx.fill();
    ctx.fillStyle = '#ff4d4d';
    this.roundedRect(x, y, width * Math.max(0, game.boss.hp) / game.boss.maxHp, height, height);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${Math.round(game.height * 0.018)}px sans-serif`;
    ctx.fillText('BOSS', game.width * 0.5, y + height * 0.85);
    if (game.level >= 3 && game.bossShielded) {
      ctx.fillStyle = '#9fe0ff';
      ctx.font = `800 ${Math.round(game.height * 0.025)}px sans-serif`;
      ctx.fillText(`🛡 先清小怪才能打 BOSS！(剩 ${game.liveMinions})`, game.width * 0.5, y + height + game.height * 0.042);
    }
  }

  /** 讓關卡或頭目訊息在中央淡入、停留後淡出。 */
  drawBanner(game) {
    const ctx = this.context;
    const banner = game.banner;
    const alpha = banner.time < 0.3
      ? banner.time / 0.3
      : banner.time > 1.7 ? Math.max(0, (2.2 - banner.time) / 0.5) : 1;
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = `900 ${Math.round(game.height * (banner.big ? 0.09 : 0.06))}px sans-serif`;
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(0,0,0,.6)';
    ctx.fillStyle = '#fff';
    ctx.strokeText(banner.text, game.width * 0.5, game.height * 0.46);
    ctx.fillText(banner.text, game.width * 0.5, game.height * 0.46);
    ctx.globalAlpha = 1;
  }

  /** 以裁切區域支援滿心、半心與空心三種生命顯示。 */
  drawHeart(centerX, centerY, size, ratio) {
    const ctx = this.context;
    this.heartPath(centerX, centerY, size);
    ctx.fillStyle = 'rgba(46,14,22,0.6)';
    ctx.fill();
    if (ratio > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(centerX - size * 1.25, centerY - size * 1.1, size * 2.5 * ratio, size * 2);
      ctx.clip();
      this.heartPath(centerX, centerY, size);
      ctx.fillStyle = '#ff4d6d';
      ctx.fill();
      ctx.restore();
    }
    this.heartPath(centerX, centerY, size);
    ctx.lineWidth = Math.max(1.4, size * 0.16);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.stroke();
  }

  /** 建立愛心的共用貝茲曲線路徑，供填色與外框重複使用。 */
  heartPath(x, y, size) {
    const ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.78);
    ctx.bezierCurveTo(x - size * 1.15, y - size * 0.05, x - size * 0.6, y - size, x, y - size * 0.32);
    ctx.bezierCurveTo(x + size * 0.6, y - size, x + size * 1.15, y - size * 0.05, x, y + size * 0.78);
    ctx.closePath();
  }

  /** 建立圓角矩形路徑，供資訊底板與血條使用。 */
  roundedRect(x, y, width, height, radius) {
    const ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  /** 建立交錯外半徑與內半徑的星形粒子路徑。 */
  star(centerX, centerY, outer, inner, points) {
    const ctx = this.context;
    ctx.beginPath();
    for (let index = 0; index < points * 2; index += 1) {
      const radius = index % 2 ? inner : outer;
      const angle = index / (points * 2) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.closePath();
  }
}
