import {
  CONFIG,
  DIFFICULTIES,
  bossArtForLevel,
  bossHpForLevel,
  bossNameForLevel,
  depthScale,
  depthY,
  miniBossForLevel,
} from './config.js';

/**
 * 遊戲規則與狀態的核心類別。
 * 它管理關卡、敵人、分數與主迴圈，但把畫面、音訊及攝影機細節交給各自的服務。
 */
export class ZombieGame {
  /** 注入 Canvas、繪圖器與服務，建立初始狀態並綁定玩家輸入。 */
  constructor({ canvas, stage, renderer, motionTracker, audio, onGameOver }) {
    this.canvas = canvas;
    this.stage = stage;
    this.renderer = renderer;
    this.motionTracker = motionTracker;
    this.audio = audio;
    this.onGameOver = onGameOver;
    this.state = 'menu';
    this.inputMode = 'camera';
    this.gameMode = 'timed';
    this.difficulty = DIFFICULTIES.normal;
    this.showCamera = this.isMobileDevice();
    this.showMotion = true;
    this.godMode = false;
    this.width = 0;
    this.height = 0;
    this.lastFrameTime = 0;
    this.animationFrame = null;
    this.resetRuntime();
    this.resize();
    this.attachInput();
  }

  /** 判斷是否為手機或粗略觸控裝置，用來決定攝影機疊圖的預設值。 */
  isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent || '')
      || (navigator.maxTouchPoints > 1 && matchMedia('(pointer:coarse)').matches);
  }

  /** 依遊戲區尺寸調整 Canvas 實際解析度，並保存邏輯寬高供命中與景深計算。 */
  resize() {
    const size = this.renderer.resize(this.stage);
    this.width = size.width;
    this.height = size.height;
  }

  /** 啟動唯一的 requestAnimationFrame 迴圈。 */
  run() {
    if (this.animationFrame) return;
    this.animationFrame = requestAnimationFrame((time) => this.loop(time));
  }

  /**
   * 每幀入口：限制最大時間差，遊戲中更新規則與繪圖，選單中則播放待機動畫。
   */
  loop(time) {
    const deltaTime = Math.min(0.05, (time - this.lastFrameTime) / 1000 || 0);
    this.lastFrameTime = time;
    if (this.state === 'playing') {
      this.update(deltaTime);
      if (this.state === 'playing') this.renderer.render(this);
    } else if (this.state === 'menu') {
      this.renderer.renderAttract(this, deltaTime);
    }
    this.animationFrame = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  /** 將所有「單局會變動」的資料重設，保留玩家偏好與已注入的服務。 */
  resetRuntime() {
    this.zombies = [];
    this.particles = [];
    this.popups = [];
    this.bombs = [];
    this.score = 0;
    this.kills = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.comboTimer = 0;
    this.hp = CONFIG.baseHp;
    this.timeLeft = CONFIG.gameTime;
    this.level = 1;
    this.phase = 'wave';
    this.phaseTime = 0;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.boss = null;
    this.waveTotal = 0;
    this.midWaveEventDone = false;
    this.banner = null;
    this.hurtFlash = 0;
    this.shake = 0;
    this.elapsed = 0;
    this.dangerNow = false;
    this.freezeTime = 0;
    this.freezeUsed = false;
    this.liveMinions = 0;
    this.levelMinionPool = ['normal', 'club'];
    this.bossBombTime = 0;
    this.bossBombDone = false;
    this.bossShielded = false;
    this.zoneCooldowns = new Array(CONFIG.hitZones).fill(0);
  }

  /** 套用輸入模式、玩法及難度，重設單局狀態並從第一關開始。 */
  start({ inputMode, gameMode, difficulty }) {
    this.inputMode = inputMode;
    this.gameMode = gameMode;
    this.difficulty = DIFFICULTIES[difficulty] || DIFFICULTIES.normal;
    this.resetRuntime();
    this.showMotion = inputMode === 'camera';
    this.motionTracker.reset();
    if (this.audio.musicOn) this.audio.startMusic();
    this.state = 'playing';
    this.startLevel(1);
    this.lastFrameTime = performance.now();
  }

  /** 結束本局、播放對應音效，並把結算資料交給 UI 控制器。 */
  endGame(won = false) {
    if (this.state === 'over') return;
    this.state = 'over';
    if (won) this.audio.win(); else this.audio.gameOver();
    this.audio.say(won ? '恭喜通關' : '遊戲結束');
    this.onGameOver?.({ won, score: this.score, kills: this.kills, level: this.level });
  }

  /** 回到選單狀態；下一幀會自動切換成選單待機動畫。 */
  returnToMenu() {
    this.state = 'menu';
    this.lastFrameTime = performance.now();
  }

  /** 綁定滑鼠與觸控事件，並將瀏覽器座標換成 Canvas 邏輯座標。 */
  attachInput() {
    this.canvas.addEventListener('mousedown', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.clickAt(event.clientX - rect.left, event.clientY - rect.top);
    });
    this.canvas.addEventListener('touchstart', (event) => {
      if (this.inputMode !== 'click') return;
      event.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      for (const touch of event.changedTouches) {
        this.clickAt(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    }, { passive: false });
  }

  /**
   * 點擊模式命中判定：先檢查炸彈桶，再選擇點擊範圍內景深最靠前的殭屍。
   */
  clickAt(x, y) {
    if (this.state !== 'playing' || this.inputMode !== 'click') return;
    for (let index = this.bombs.length - 1; index >= 0; index -= 1) {
      const bomb = this.bombs[index];
      const height = depthScale(bomb.progress, this.height) * 0.8;
      const bombY = depthY(bomb.progress, this.height);
      if (x >= bomb.fx - height * 0.45 && x <= bomb.fx + height * 0.45 && y >= bombY - height && y <= bombY) {
        bomb.dead = true;
        this.explodeBomb(bomb);
        return;
      }
    }

    let target = null;
    let nearestProgress = -1;
    for (const zombie of this.zombies) {
      if (zombie.state === 'dead') continue;
      const image = this.renderer.assets.imageForZombie(zombie);
      const aspect = this.renderer.assets.isLoaded(image) ? image.naturalWidth / image.naturalHeight : 0.7;
      const height = depthScale(zombie.progress, this.height) * zombie.sizeMultiplier;
      const width = height * aspect;
      const floorY = depthY(zombie.progress, this.height);
      if (x >= zombie.fx - width * 0.55 && x <= zombie.fx + width * 0.55
        && y >= floorY - height && y <= floorY + height * 0.08
        && zombie.progress > nearestProgress) {
        target = zombie;
        nearestProgress = zombie.progress;
      }
    }
    if (target) this.hitZombie(target);
  }

  /** 依關卡產生帶少量隨機差異的普通移動速度。 */
  zombieSpeed() {
    return (0.055 + this.level * 0.005) * (0.85 + Math.random() * 0.4);
  }

  /**
   * 建立統一的殭屍狀態物件，再依種類覆寫血量、大小、速度與特殊能力。
   */
  makeZombie(type, options = {}) {
    const fx = options.fx ?? this.width * (0.08 + Math.random() * 0.84);
    const zombie = {
      type,
      fx,
      progress: options.progress ?? (type === 'boss' ? 0 : 0.2 + Math.random() * 0.14),
      speed: options.speed || this.zombieSpeed(),
      art: Math.random() < 0.5 ? 'normal0' : 'normal1',
      sizeMultiplier: 1,
      bob: Math.random() * Math.PI * 2,
      wob: Math.random() * Math.PI * 2,
      hp: 1,
      maxHp: 1,
      bucketOn: false,
      bucketDented: false,
      club: false,
      boss: false,
      miniBoss: false,
      dancer: false,
      tiny: false,
      summoned: false,
      state: 'walk',
      deadTime: 0,
      hitCooldown: 0,
      attackTime: 0,
      lungeTime: 0,
      flash: 0,
      swingDirection: 1,
    };

    if (type === 'bucket') Object.assign(zombie, { bucketOn: true, hp: 2, maxHp: 2 });
    if (type === 'club') zombie.club = true;
    if (type === 'tiny') Object.assign(zombie, { tiny: true, sizeMultiplier: 0.5, speed: options.speed || this.zombieSpeed() * 2.64 });
    if (type === 'dancer') Object.assign(zombie, {
      dancer: true, hp: 2, maxHp: 2, dancing: false, stepTime: 0, danceTime: 0,
      speed: options.speed || this.zombieSpeed() * 0.85,
    });
    if (type === 'boss') Object.assign(zombie, {
      boss: true,
      bossArtKey: options.bossArtKey || 'boss',
      sizeMultiplier: 1.7,
      hp: Math.max(1, Math.round((options.hp || 16) * this.difficulty.bossMultiplier)),
      minionTime: 2.6,
      dodgeTime: 2.5,
      speed: options.speed || this.zombieSpeed() * 0.5,
    });
    if (type === 'miniBoss') Object.assign(zombie, {
      miniBoss: true,
      bossArtKey: options.bossArtKey || 'boss',
      sizeMultiplier: 1.2,
      hp: Math.max(1, Math.round((options.hp || 8) * this.difficulty.bossMultiplier)),
      speed: options.speed || this.zombieSpeed() * 0.7,
      dodgeTime: 2.2,
    });
    zombie.maxHp = zombie.hp;
    return zombie;
  }

  /**
   * 建立一關的小怪佇列：依關卡解鎖種類、套用難度倍率、限制舞者數量後洗牌。
   */
  startLevel(level) {
    this.level = level;
    this.phase = 'wave';
    this.spawnTimer = 0.6;
    this.boss = null;
    this.midWaveEventDone = false;
    const counts = this.gameMode === 'timed' ? [15, 19, 23, 27, 31] : [20, 30, 40, 55, 60];
    const baseCount = level <= 5 ? counts[level - 1] : Math.min(90, 60 + (level - 5) * 8);
    const count = Math.max(1, Math.round(baseCount * this.difficulty.countMultiplier));
    const types = ['normal', 'club'];
    if (level >= 2) types.push('bucket');
    if (level >= 3) types.push('tiny');
    if (level >= 4) types.push('dancer');
    const weights = { normal: 3, club: 2, bucket: 2, tiny: 2, dancer: 1 };

    this.levelMinionPool = [];
    for (const type of types) {
      if (type === 'dancer') continue;
      for (let index = 0; index < weights[type]; index += 1) this.levelMinionPool.push(type);
    }

    const queue = [];
    const dancerMaximum = level >= 4 ? Math.min(8, 4 + (level - 4) * 2) : 0;
    for (let index = 0; index < dancerMaximum; index += 1) queue.push('dancer');
    const regularTypes = types.filter((type) => type !== 'dancer');
    const totalWeight = regularTypes.reduce((sum, type) => sum + weights[type], 0);
    while (queue.length < count) {
      let random = Math.random() * totalWeight;
      let selection = regularTypes[0];
      for (const type of regularTypes) {
        if (random < weights[type]) { selection = type; break; }
        random -= weights[type];
      }
      queue.push(selection);
    }
    for (let index = queue.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
    }

    this.spawnQueue = queue;
    this.waveTotal = queue.length;
    this.banner = { text: `第 ${level} 關`, time: 0, big: true };
    if (level >= 2) {
      const chineseNumbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      this.audio.say(`第${chineseNumbers[level] || level}關`);
    }
  }

  /** 清完波次後生成主頭目；第四、五關還會在兩側加入小頭目。 */
  spawnBoss() {
    this.boss = this.makeZombie('boss', {
      hp: bossHpForLevel(this.level, this.gameMode),
      fx: this.width * 0.5,
      speed: this.zombieSpeed() * 0.5,
      bossArtKey: bossArtForLevel(this.level),
    });
    this.zombies.push(this.boss);
    this.bossBombDone = false;
    this.bossBombTime = 4;
    const sidePositions = this.level >= 5
      ? [this.width * 0.22, this.width * 0.78]
      : this.level >= 4 ? [this.width * 0.24] : [];
    sidePositions.forEach((fx) => {
      const miniBoss = this.makeZombie('miniBoss', { fx, bossArtKey: bossArtForLevel(this.level - 1), hp: 12 });
      miniBoss.progress = this.boss.progress;
      this.zombies.push(miniBoss);
    });
    this.banner = { text: `⚠ ${bossNameForLevel(this.level)} 出現！`, time: 0, big: true };
    this.audio.boss();
  }

  /** 主頭目死亡時進入過關倒數，並清除場上仍存活的小怪。 */
  onBossDead() {
    this.boss = null;
    this.phase = 'clear';
    this.phaseTime = 2;
    this.shake = 0.6;
    this.banner = { text: `第 ${this.level} 關 完成！`, time: 0, big: true };
    for (const zombie of this.zombies) {
      if (zombie.state !== 'dead' && !zombie.boss) {
        zombie.state = 'dead';
        zombie.deadTime = 0;
        this.burst(zombie.fx, depthY(zombie.progress, this.height) - depthScale(zombie.progress, this.height) * zombie.sizeMultiplier * 0.5, '#8ed16a', 1);
      }
    }
  }

  /**
   * 單幀規則入口：處理計時、連擊、攝影機偵測，再依序更新波次、炸彈、敵人與特效。
   */
  update(deltaTime) {
    if (this.state !== 'playing') return;
    this.elapsed += deltaTime;
    if (this.gameMode === 'timed') {
      this.timeLeft -= deltaTime;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.endGame(this.level >= 5 && this.phase === 'clear');
        return;
      }
    }
    if (this.comboTimer > 0) {
      this.comboTimer -= deltaTime;
      if (this.comboTimer <= 0) this.combo = 0;
    }
    this.zoneCooldowns = this.zoneCooldowns.map((cooldown) => Math.max(0, cooldown - deltaTime));
    this.hurtFlash = Math.max(0, this.hurtFlash - deltaTime);
    if (this.banner) {
      this.banner.time += deltaTime;
      if (this.banner.time > 2.2) this.banner = null;
    }
    if (this.inputMode === 'camera') this.motionTracker.detect();

    this.updateWave(deltaTime);
    this.updateBombs(deltaTime);
    this.updateZombies(deltaTime);
    this.updateEffects(deltaTime);
  }

  /**
   * 推進關卡狀態機：小怪波次 → 中途事件 → 頭目戰 → 過關等待 → 下一關。
   */
  updateWave(deltaTime) {
    if (this.phase === 'wave') {
      this.spawnTimer -= deltaTime;
      const spawnGap = Math.max(0.28, 0.6 - this.level * 0.04);
      if (this.spawnQueue.length && this.spawnTimer <= 0) {
        this.zombies.push(this.makeZombie(this.spawnQueue.shift()));
        this.spawnTimer = spawnGap;
      }
      if (!this.midWaveEventDone && this.spawnQueue.length <= this.waveTotal / 2) {
        this.midWaveEventDone = true;
        this.spawnBomb();
        const miniBoss = miniBossForLevel(this.level);
        if (miniBoss) {
          this.zombies.push(this.makeZombie('miniBoss', { bossArtKey: miniBoss.artKey, hp: miniBoss.hp }));
          this.banner = { text: `⚠ 中途頭目：${miniBoss.name}`, time: 0, big: false };
          this.audio.boss();
        }
      }
      if (this.spawnQueue.length === 0 && !this.zombies.some((zombie) => zombie.state !== 'dead')) {
        this.phase = 'boss';
        this.spawnBoss();
      }
    } else if (this.phase === 'clear') {
      this.phaseTime -= deltaTime;
      if (this.phaseTime <= 0) {
        if (this.gameMode === 'timed' && this.level >= 5) this.endGame(true);
        else this.startLevel(this.level + 1);
      }
    }
    if (this.phase === 'boss' && this.boss && this.level >= 3 && !this.bossBombDone) {
      this.bossBombTime -= deltaTime;
      if (this.bossBombTime <= 0) {
        this.bossBombDone = true;
        this.spawnBomb();
      }
    }
  }

  /** 更新炸彈存在時間，攝影機模式下也會計算揮手是否命中。 */
  updateBombs(deltaTime) {
    for (const bomb of this.bombs) {
      bomb.time += deltaTime;
      if (this.inputMode !== 'camera') continue;
      const height = depthScale(bomb.progress, this.height) * 0.8;
      const radius = Math.max(3, Math.round(height / this.height * CONFIG.processHeight * 0.45));
      const movement = this.motionTracker.motionAt(
        bomb.fx,
        depthY(bomb.progress, this.height) - height * 0.5,
        radius,
        radius,
        this.width,
        this.height,
      );
      if (movement >= this.motionTracker.sensitivity) {
        bomb.dead = true;
        this.explodeBomb(bomb);
      }
    }
    this.bombs = this.bombs.filter((bomb) => !bomb.dead && bomb.time < bomb.life);
  }

  /**
   * 更新全部殭屍：護盾、冰凍、攝影機分區命中、移動／攻擊以及死亡回收。
   * 體感命中按四個橫向區域各自冷卻，避免多人互相鎖住操作。
   */
  updateZombies(deltaTime) {
    this.liveMinions = this.zombies.filter((zombie) => zombie.state !== 'dead' && !zombie.boss && !zombie.miniBoss).length;
    if (this.liveMinions > 12) this.bossShielded = true;
    else if (this.liveMinions < 10) this.bossShielded = false;
    this.freezeTime = Math.max(0, this.freezeTime - deltaTime);
    const motionHitsByZone = [];

    for (const zombie of this.zombies) {
      if (zombie.state === 'dead') { zombie.deadTime += deltaTime; continue; }
      zombie.hitCooldown = Math.max(0, zombie.hitCooldown - deltaTime);
      zombie.flash = Math.max(0, zombie.flash - deltaTime);
      zombie.lungeTime = Math.max(0, zombie.lungeTime - deltaTime);
      zombie.bob += deltaTime * 7.5;
      zombie.wob += deltaTime * 4.5;

      if (this.inputMode === 'camera' && zombie.hitCooldown <= 0) {
        const height = depthScale(zombie.progress, this.height) * zombie.sizeMultiplier;
        const width = height * 0.62;
        const targetY = depthY(zombie.progress, this.height) - height * 0.5;
        const radiusX = Math.max(3, Math.round(width / this.width * CONFIG.processWidth * 0.5));
        const radiusY = Math.max(3, Math.round(height / this.height * CONFIG.processHeight * 0.4));
        const zone = Math.max(0, Math.min(CONFIG.hitZones - 1, Math.floor(zombie.fx / this.width * CONFIG.hitZones)));
        const movement = this.motionTracker.motionAt(zombie.fx, targetY, radiusX, radiusY, this.width, this.height);
        if (this.zoneCooldowns[zone] <= 0 && movement >= this.motionTracker.sensitivity) {
          motionHitsByZone[zone] ||= [];
          motionHitsByZone[zone].push(zombie);
        }
      }
      if (this.freezeTime > 0) continue;

      this.moveZombie(zombie, deltaTime);
      if (zombie.boss) this.updateBoss(zombie, deltaTime);
      else if (zombie.miniBoss && this.level >= 3) this.bossDodge(zombie, deltaTime);
    }

    for (let zone = 0; zone < CONFIG.hitZones; zone += 1) {
      const candidates = motionHitsByZone[zone];
      if (!candidates?.length) continue;
      candidates.sort((a, b) => b.progress - a.progress);
      candidates.slice(0, CONFIG.motionHitMax).forEach((zombie) => this.hitZombie(zombie));
      this.zoneCooldowns[zone] = CONFIG.motionHitCooldown;
    }
    this.zombies = this.zombies.filter((zombie) => !(zombie.state === 'dead' && zombie.deadTime > CONFIG.deathDuration));
    this.dangerNow = this.zombies.some((zombie) => zombie.state !== 'dead' && zombie.progress >= CONFIG.dangerProgress);
  }

  /** 推進單隻殭屍的走路、舞蹈召喚或貼臉攻擊狀態。 */
  moveZombie(zombie, deltaTime) {
    if (zombie.state === 'walk') {
      if (zombie.dancer && zombie.dancing) {
        zombie.danceTime -= deltaTime;
        if (zombie.danceTime <= 0) {
          zombie.dancing = false;
          zombie.stepTime = 0;
        }
      } else {
        zombie.progress += zombie.speed * deltaTime;
        if (zombie.dancer) {
          zombie.stepTime += deltaTime;
          if (zombie.stepTime >= CONFIG.danceStep && zombie.progress < 0.92) {
            zombie.dancing = true;
            zombie.danceTime = 1.3;
            this.summonBeside(zombie);
          }
        }
        if (zombie.progress >= 1) {
          zombie.progress = 1;
          zombie.state = 'attack';
          zombie.attackTime = CONFIG.attackPeriod * 0.6;
        }
      }
    } else if (zombie.state === 'attack') {
      zombie.attackTime -= deltaTime;
      if (zombie.attackTime <= 0) {
        zombie.attackTime = CONFIG.attackPeriod;
        zombie.lungeTime = 0.28;
        zombie.swingDirection *= -1;
        const damage = zombie.boss ? 2 : zombie.miniBoss ? 1.5 : zombie.club ? 1 : 0.5;
        this.playerHurt(damage);
        const height = depthScale(zombie.progress, this.height) * zombie.sizeMultiplier;
        this.spawnSwipe(zombie.fx, depthY(zombie.progress, this.height) - height * 0.55, height * 0.55, zombie.swingDirection);
      }
    }
  }

  /** 頭目定期閃避，並從畫面左右召喚本關已解鎖的小怪。 */
  updateBoss(zombie, deltaTime) {
    if (this.level >= 2) this.bossDodge(zombie, deltaTime);
    zombie.minionTime -= deltaTime;
    if (zombie.minionTime > 0) return;
    zombie.minionTime = Math.max(0.9, 2 - this.level * 0.06);
    for (const side of [-1, 1]) {
      const count = (this.level <= 1 ? 1 : 2) + (Math.random() < 0.5 ? 1 : 0);
      for (let index = 0; index < count; index += 1) {
        const fx = side < 0
          ? this.width * (0.05 + Math.random() * 0.22)
          : this.width * (0.73 + Math.random() * 0.22);
        const type = this.levelMinionPool[Math.floor(Math.random() * this.levelMinionPool.length)];
        this.zombies.push(this.makeZombie(type, { fx, speed: this.zombieSpeed() * 1.4 }));
      }
    }
  }

  /** 讓頭目或小頭目在左、中、右三個位置間瞬移，前後產生傳送特效。 */
  bossDodge(zombie, deltaTime) {
    zombie.dodgeTime -= deltaTime;
    if (zombie.dodgeTime > 0) return;
    zombie.dodgeTime = 2 + Math.random() * 1.6;
    const positions = [this.width * 0.2, this.width * 0.5, this.width * 0.8]
      .filter((x) => Math.abs(x - zombie.fx) > this.width * 0.12);
    const y = depthY(zombie.progress, this.height) - depthScale(zombie.progress, this.height) * zombie.sizeMultiplier * 0.4;
    this.burst(zombie.fx, y, '#9fd8ff', 1.3);
    zombie.fx = positions[Math.floor(Math.random() * positions.length)];
    this.burst(zombie.fx, y, '#9fd8ff', 1.3);
    this.audio.beep(280, 0.12, 'sine', 0.16, 560);
  }

  /**
   * 套用一次命中：先處理護盾與鐵桶凹陷，再扣血並在歸零時觸發死亡。
   */
  hitZombie(zombie) {
    zombie.hitCooldown = 0.33;
    zombie.flash = 0.14;
    if (zombie.boss && this.level >= 3 && this.bossShielded) {
      zombie.flash = 0.22;
      this.audio.clang();
      return;
    }
    if (zombie.bucketOn && !zombie.bucketDented) {
      zombie.bucketDented = true;
      zombie.hp = 1;
      this.audio.clang();
      this.dentSpark(zombie);
      this.score += 5;
      this.popups.push({
        x: zombie.fx,
        y: depthY(zombie.progress, this.height) - depthScale(zombie.progress, this.height) * zombie.sizeMultiplier * 0.92,
        time: 0,
        text: '匡!',
        combo: 0,
      });
      return;
    }
    zombie.hp -= 1;
    if (zombie.hp <= 0) this.killZombie(zombie);
    else this.audio.hit();
  }

  /** 計算死亡分數與連擊倍率、建立飄字和粒子，主頭目死亡時完成關卡。 */
  killZombie(zombie) {
    if (zombie.state === 'dead') return;
    zombie.state = 'dead';
    zombie.deadTime = 0;
    this.kills += 1;
    this.combo = this.comboTimer > 0 ? this.combo + 1 : 1;
    this.comboTimer = CONFIG.comboWindow;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    const base = zombie.boss ? 200
      : zombie.miniBoss ? 60
        : zombie.dancer ? 40
          : zombie.type === 'bucket' ? 20
            : zombie.club ? 15 : zombie.tiny ? 8 : 10;
    const gain = base * Math.min(this.combo, 8);
    this.score += gain;
    const floorY = depthY(zombie.progress, this.height);
    const height = depthScale(zombie.progress, this.height) * zombie.sizeMultiplier;
    this.popups.push({ x: zombie.fx, y: floorY - height * 0.6, time: 0, text: `+${gain}`, combo: this.combo });
    this.burst(zombie.fx, floorY - height * 0.5, '#8ed16a', zombie.boss ? 2.4 : zombie.miniBoss ? 1.6 : 1);
    this.audio.hit();
    if (this.combo > 1) this.audio.combo(this.combo);
    if (zombie.boss) this.onBossDead();
  }

  /** 扣除玩家生命；瀕死時每局觸發一次三秒全場冰凍。 */
  playerHurt(damage) {
    if (this.godMode) { this.shake = Math.max(this.shake, 0.2); return; }
    this.hp -= damage;
    this.hurtFlash = 0.45;
    this.shake = Math.max(this.shake, 0.4);
    this.audio.hurt();
    if (this.hp <= 0) {
      this.hp = 0;
      this.endGame();
    } else if (this.hp <= 1 && !this.freezeUsed) {
      this.freezeUsed = true;
      this.freezeTime = 3;
      this.audio.beep(1000, 0.4, 'sine', 0.18, 400);
      this.shake = Math.max(this.shake, 0.5);
    }
  }

  /** 跳舞殭屍在左右各召喚一隻同景深的小怪，並標記召喚光環。 */
  summonBeside(zombie) {
    for (const side of [-1, 1]) {
      const fx = Math.max(this.width * 0.05, Math.min(this.width * 0.95, zombie.fx + side * this.width * 0.11));
      const summoned = this.makeZombie('normal', { fx, speed: zombie.speed * 1.1 });
      summoned.progress = zombie.progress;
      summoned.summoned = true;
      this.zombies.push(summoned);
      this.burst(fx, depthY(summoned.progress, this.height) - depthScale(summoned.progress, this.height) * 0.3, '#d98cff', 1.1);
    }
    this.audio.beep(440, 0.08, 'square', 0.12);
    this.audio.beep(660, 0.1, 'square', 0.1);
  }

  /** 在畫面中前景的隨機位置放置一個六秒後消失的炸彈桶。 */
  spawnBomb() {
    this.bombs.push({
      fx: this.width * (0.16 + Math.random() * 0.68),
      progress: 0.5 + Math.random() * 0.35,
      time: 0,
      life: 6,
      dead: false,
    });
  }

  /** 引爆炸彈並讓場上每隻存活敵人各承受一次普通命中。 */
  explodeBomb(bomb) {
    this.burst(bomb.fx, depthY(bomb.progress, this.height) - depthScale(bomb.progress, this.height) * 0.4, '#ffae3b', 3);
    this.shake = Math.max(this.shake, 0.6);
    this.hurtFlash = Math.max(this.hurtFlash, 0.12);
    this.audio.bomb();
    this.zombies.filter((zombie) => zombie.state !== 'dead').forEach((zombie) => this.hitZombie(zombie));
    this.popups.push({ x: this.width * 0.5, y: this.height * 0.32, time: 0, text: '💥 全體攻擊!', combo: 2 });
  }

  /** 建立放射狀碎片與裂痕；multiplier 同時控制粒子數、速度及尺寸。 */
  burst(x, y, color, multiplier = 1) {
    const count = (18 * multiplier) | 0;
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (120 + Math.random() * 340) * multiplier;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        life: 0.55 + Math.random() * 0.35,
        time: 0,
        size: (4 + Math.random() * 7) * multiplier,
        color: Math.random() < 0.6 ? '#ffe14d' : color,
        star: Math.random() < 0.5,
      });
    }
    this.particles.push({ crack: true, x, y, time: 0, life: 0.45, size: this.height * 0.16 * multiplier });
  }

  /** 在垃圾桶上緣產生少量金屬火花，提示桶子已被打凹。 */
  dentSpark(zombie) {
    const height = depthScale(zombie.progress, this.height) * zombie.sizeMultiplier;
    const x = zombie.fx;
    const y = depthY(zombie.progress, this.height) - height * 0.88;
    for (let index = 0; index < 8; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 180;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.4,
        time: 0,
        size: 3 + Math.random() * 4,
        color: '#ffe14d',
        star: false,
      });
    }
  }

  /** 建立殭屍攻擊時的短暫弧形揮擊軌跡。 */
  spawnSwipe(x, y, size, direction) {
    this.particles.push({ swipe: true, x, y, size, direction, time: 0, life: 0.22 });
  }

  /** 更新粒子物理、飄字上升與鏡頭震動衰減，並移除逾時特效。 */
  updateEffects(deltaTime) {
    for (const particle of this.particles) {
      particle.time += deltaTime;
      if (!particle.crack && !particle.swipe) {
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.vy += 900 * deltaTime;
      }
    }
    this.particles = this.particles.filter((particle) => particle.time < particle.life);
    for (const popup of this.popups) {
      popup.time += deltaTime;
      popup.y -= 40 * deltaTime;
    }
    this.popups = this.popups.filter((popup) => popup.time < 0.9);
    this.shake = Math.max(0, this.shake - deltaTime * 1.5);
  }

  /** 回傳不含可變物件參照的精簡狀態，供展示模式與自動測試讀取。 */
  snapshot() {
    return {
      state: this.state,
      level: this.level,
      phase: this.phase,
      hp: this.hp,
      timeLeft: this.timeLeft,
      inputMode: this.inputMode,
      zombies: this.zombies.length,
      bombs: this.bombs.length,
      bossHp: this.boss?.hp ?? null,
    };
  }
}
