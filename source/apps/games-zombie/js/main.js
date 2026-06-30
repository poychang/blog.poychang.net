import { ZombieGame } from './game/game.js';
import { CONFIG } from './game/config.js';
import { GameRenderer } from './game/renderer.js';
import { AssetStore } from './services/assets.js';
import { AudioManager } from './services/audio.js';
import { MotionTracker } from './services/motion-tracker.js';
import { addScore, getScores, loadCalibration, saveCalibration } from './services/storage.js';

// 本檔是應用程式組裝層：負責 DOM 與按鈕，不包含戰鬥或繪圖規則。
/** 以 id 取得頁面元素，讓後續 DOM 對照表保持精簡。 */
const byId = (id) => document.getElementById(id);

// 集中保存會重複使用的 DOM 節點，避免各事件處理器散落查詢字串。
const ui = {
  stage: byId('stage'),
  video: byId('cam'),
  canvas: byId('game'),
  menu: byId('menu'),
  over: byId('over'),
  hint: byId('hint'),
  hintToggle: byId('hintToggle'),
  menuError: byId('menuErr'),
  timed: byId('timedBtn'),
  endless: byId('endlessBtn'),
  easy: byId('easyBtn'),
  normal: byId('normalBtn'),
  hard: byId('hardBtn'),
  music: byId('musicBtn'),
  sensitivity: byId('sensVal'),
  mirror: byId('mirrorBtn2'),
  rotation: byId('rotBtn2'),
  cameraDisplay: byId('camBtn2'),
  end: byId('endBtn2'),
  god: byId('godBtn'),
};

const assets = new AssetStore();
const audio = new AudioManager();
const motionTracker = new MotionTracker(ui.video, CONFIG);
const renderer = new GameRenderer(ui.canvas, assets, motionTracker);

// 選單選項與結算倒數屬於 UI 狀態，不放進遊戲核心。
let selectedGameMode = 'timed';
let selectedDifficulty = 'normal';
let overTimer = null;
let overCountdown = 0;
let endConfirmationArmed = false;

const game = new ZombieGame({
  canvas: ui.canvas,
  stage: ui.stage,
  renderer,
  motionTracker,
  audio,
  onGameOver: showGameOver,
});

const calibration = loadCalibration({ mirror: true, rotation: 0, sensitivity: 12 });
Object.assign(motionTracker, calibration);

/** 更新同一群單選按鈕的外觀與 aria-pressed，確保視覺和輔助資訊一致。 */
function selectButtons(buttons, selected) {
  buttons.forEach((button) => {
    const active = button === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

/** 從 localStorage 產生最高分榜；資料較多時複製一份做無縫循環捲動。 */
function renderScores() {
  const element = byId('hiscore');
  const scores = getScores();
  if (!scores.length) {
    element.innerHTML = '<div class="hs-title">🏆 最高分</div><div class="hs-empty">還沒有紀錄，快來當第一名！</div>';
    return;
  }
  const rows = scores.map((entry, index) => (
    `<div class="hs-row"><span class="hs-rank">${index + 1}.</span><span class="hs-score">${entry.score}</span><span class="hs-date">${entry.date}</span></div>`
  )).join('');
  const shouldLoop = scores.length > 6;
  const content = shouldLoop ? rows + rows : rows;
  const duration = Math.max(10, Math.round(scores.length * 0.7));
  const style = shouldLoop ? ` style="animation:hs-loop ${duration}s linear infinite"` : '';
  element.innerHTML = `<div class="hs-title">🏆 最高分 TOP 20</div><div class="hs-list"><div class="hs-scroll"${style}>${content}</div></div>`;
}

/** 隱藏選單與結算畫面，依輸入模式顯示正確的遊戲中控制列。 */
function showPlaying(inputMode) {
  clearOverTimer();
  ui.menu.classList.add('hidden');
  ui.over.classList.add('hidden');
  ui.hint.classList.remove('hidden');
  ui.hint.classList.toggle('click-mode', inputMode === 'click');
  endConfirmationArmed = false;
  ui.end.textContent = '✖ 結束';
}

/**
 * 開始一局；攝影機模式會先等待權限與串流成功，點擊模式則可立即進入。
 */
async function startGame(inputMode) {
  audio.ensureContext();
  if (inputMode === 'camera') {
    ui.menuError.textContent = '正在開啟攝影機…';
    try {
      await motionTracker.startCamera();
    } catch (error) {
      const reason = error?.message || String(error);
      ui.menuError.textContent = `⚠️ 無法開啟攝影機：${reason}。沒有攝影機也能使用滑鼠／觸控模式遊玩。`;
      return;
    }
  }
  ui.menuError.textContent = '';
  showPlaying(inputMode);
  game.start({ inputMode, gameMode: selectedGameMode, difficulty: selectedDifficulty });
}

/** 使用上一局的輸入模式及目前選單設定重新開始。 */
function restart() {
  startGame(game.inputMode);
}

/** 停止結算倒數、切換核心狀態，並重新顯示主選單。 */
function backToMenu() {
  clearOverTimer();
  game.returnToMenu();
  ui.over.classList.add('hidden');
  ui.hint.classList.add('hidden');
  ui.menu.classList.remove('hidden');
}

/** 寫入分數、更新結算文字與最高分榜，最後啟動十秒自動重玩。 */
function showGameOver(result) {
  const oldTopScore = getScores()[0]?.score || 0;
  const isRecord = result.score > 0 && result.score > oldTopScore;
  const updatedScores = addScore(result.score);
  renderScores();
  byId('overTitle').textContent = result.won ? '🎉 恭喜通關！' : '遊戲結束';
  byId('finalScore').textContent = result.score;
  byId('finalKills').textContent = result.kills;
  byId('finalLevel').textContent = result.level;
  byId('overRecord').textContent = isRecord ? '🎉 新最高分紀錄！' : `🏆 目前最高分 ${updatedScores[0]?.score || 0}`;
  ui.over.classList.remove('hidden');
  ui.hint.classList.add('hidden');
  startOverTimer();
}

/** 清除結算自動重玩的 interval，避免重複計時。 */
function clearOverTimer() {
  if (overTimer) clearInterval(overTimer);
  overTimer = null;
}

/** 每秒更新結算倒數；玩家沒有操作十秒就自動開始同模式新局。 */
function startOverTimer() {
  clearOverTimer();
  overCountdown = 10;
  const label = byId('overCount');
  label.textContent = '10 秒沒動作就自動再來一局…';
  overTimer = setInterval(() => {
    overCountdown -= 1;
    label.textContent = `${overCountdown} 秒沒動作就自動再來一局…`;
    if (overCountdown <= 0) restart();
  }, 1000);
}

/** 把目前攝影機設定同步到遊戲中控制列。 */
function updateCalibrationLabels() {
  ui.sensitivity.textContent = `靈敏度 ${motionTracker.sensitivity}`;
  ui.mirror.textContent = `🪞 鏡像 ${motionTracker.mirror ? '開' : '關'}`;
  ui.rotation.textContent = `🔄 旋轉 ${motionTracker.rotation}°`;
  ui.cameraDisplay.textContent = `📷 攝影機 ${game.showCamera ? '顯示' : '關閉'}`;
}

/** 將動作偵測的三項校正值保存到 localStorage。 */
function persistCalibration() {
  saveCalibration({
    mirror: motionTracker.mirror,
    rotation: motionTracker.rotation,
    sensitivity: motionTracker.sensitivity,
  });
}

/** 調整動作門檻；數字越小越容易被判定為揮動，最低限制為 2。 */
function changeSensitivity(amount) {
  motionTracker.sensitivity = Math.max(2, motionTracker.sensitivity + amount);
  updateCalibrationLabels();
  persistCalibration();
}

/** 切換攝影機鏡像並立即保存校正。 */
function toggleMirror() {
  motionTracker.mirror = !motionTracker.mirror;
  updateCalibrationLabels();
  persistCalibration();
}

/** 將攝影機順時針旋轉 90 度，供側裝或倒裝投影情境校正。 */
function rotateCamera() {
  motionTracker.rotation = (motionTracker.rotation + 90) % 360;
  updateCalibrationLabels();
  persistCalibration();
}

/** 只切換遊戲背景中的攝影機疊圖，不會關閉實際動作偵測。 */
function toggleCameraDisplay() {
  game.showCamera = !game.showCamera;
  updateCalibrationLabels();
}

/** 切換瀏覽器全螢幕，進入後盡可能將行動裝置鎖定為橫向。 */
function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      Promise.resolve(document.documentElement.requestFullscreen())
        .then(() => screen.orientation?.lock?.('landscape')?.catch(() => {}))
        .catch(() => {});
    } else {
      screen.orientation?.unlock?.();
      document.exitFullscreen();
    }
  } catch {
    // Fullscreen and orientation locking vary by browser.
  }
}

/** 切換合成背景音樂，並同步右上角圖示。 */
function toggleMusic() {
  ui.music.textContent = audio.toggleMusic() ? '🔊' : '🔇';
}

/** 遊戲中結束按鈕需在 2.5 秒內按兩次，降低觸控誤按機率。 */
function requestEnd() {
  if (game.state !== 'playing') return;
  if (endConfirmationArmed) {
    endConfirmationArmed = false;
    ui.end.textContent = '✖ 結束';
    game.endGame();
    return;
  }
  endConfirmationArmed = true;
  ui.end.textContent = '✖ 確定結束?';
  setTimeout(() => {
    if (!endConfirmationArmed) return;
    endConfirmationArmed = false;
    ui.end.textContent = '✖ 結束';
  }, 2500);
}

/** 集中註冊選單、校正、鍵盤、視窗與結算相關事件。 */
function bindControls() {
  ui.timed.addEventListener('click', () => {
    selectedGameMode = 'timed';
    selectButtons([ui.timed, ui.endless], ui.timed);
  });
  ui.endless.addEventListener('click', () => {
    selectedGameMode = 'endless';
    selectButtons([ui.timed, ui.endless], ui.endless);
  });
  ui.easy.addEventListener('click', () => {
    selectedDifficulty = 'easy';
    selectButtons([ui.easy, ui.normal, ui.hard], ui.easy);
  });
  ui.normal.addEventListener('click', () => {
    selectedDifficulty = 'normal';
    selectButtons([ui.easy, ui.normal, ui.hard], ui.normal);
  });
  ui.hard.addEventListener('click', () => {
    selectedDifficulty = 'hard';
    selectButtons([ui.easy, ui.normal, ui.hard], ui.hard);
  });

  byId('camBtn').addEventListener('click', () => startGame('camera'));
  byId('clickBtn').addEventListener('click', () => startGame('click'));
  byId('againBtn').addEventListener('click', restart);
  byId('menuBtn').addEventListener('click', backToMenu);
  ui.music.addEventListener('click', toggleMusic);
  byId('fsBtn').addEventListener('click', toggleFullscreen);
  byId('sensDown').addEventListener('click', () => changeSensitivity(-2));
  byId('sensUp').addEventListener('click', () => changeSensitivity(2));
  ui.mirror.addEventListener('click', toggleMirror);
  ui.rotation.addEventListener('click', rotateCamera);
  ui.cameraDisplay.addEventListener('click', toggleCameraDisplay);
  ui.end.addEventListener('click', requestEnd);
  ui.god.addEventListener('click', () => {
    game.godMode = !game.godMode;
    ui.god.textContent = game.godMode ? '🛡 無敵 ✔' : '🛡 無敵';
  });
  ui.hintToggle.addEventListener('click', () => {
    ui.hint.classList.toggle('collapsed');
    ui.hintToggle.textContent = ui.hint.classList.contains('collapsed') ? '⚙' : '▾';
  });

  window.addEventListener('resize', () => game.resize());
  window.addEventListener('keydown', (event) => {
    if (event.key === ']') changeSensitivity(-2);
    else if (event.key === '[') changeSensitivity(2);
    else if (event.key.toLowerCase() === 'm') toggleMirror();
    else if (event.key.toLowerCase() === 'r') rotateCamera();
    else if (event.key.toLowerCase() === 'c') toggleCameraDisplay();
    else if (event.key.toLowerCase() === 'n') game.showMotion = !game.showMotion;
    else if (event.key.toLowerCase() === 'f') toggleFullscreen();
    else if (event.key.toLowerCase() === 'b') toggleMusic();
    else if (event.key === 'Escape' && game.state === 'playing') game.endGame();
    else if (event.key === ' ' && game.state === 'over') restart();
  });
}

// 啟動順序：先綁事件與還原 UI，再啟動繪圖迴圈，圖片則在背景非同步載入。
bindControls();
renderScores();
updateCalibrationLabels();
if (game.isMobileDevice()) ui.hint.classList.add('collapsed');
ui.hintToggle.textContent = ui.hint.classList.contains('collapsed') ? '⚙' : '▾';
game.run();
const assetsReady = assets.load();

// ?demo 提供不需要攝影機的展示／自動測試入口，並公開少量診斷操作。
if (new URLSearchParams(location.search).has('demo')) {
  await assetsReady;
  showPlaying('click');
  game.start({ inputMode: 'click', gameMode: selectedGameMode, difficulty: selectedDifficulty });
  window.__zombieDemo = {
    state: () => game.snapshot(),
    spawn: (type = 'normal') => game.zombies.push(game.makeZombie(type, { speed: 0.1 })),
    boss: () => game.spawnBoss(),
    bomb: () => game.spawnBomb(),
    click: (x, y) => game.clickAt(x, y),
    end: () => game.endGame(),
  };
}
