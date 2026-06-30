// 集中管理會影響整體玩法的數值，避免規則散落在遊戲迴圈與繪圖程式中。
export const CONFIG = Object.freeze({
  baseHp: 6,
  gameTime: 180,
  processWidth: 160,
  processHeight: 90,
  pixelDifference: 26,
  comboWindow: 1.2,
  horizon: 0.4,
  front: 0.96,
  farScale: 0.15,
  nearScale: 0.46,
  attackPeriod: 1.15,
  dangerProgress: 0.86,
  deathDuration: 0.7,
  danceStep: 2,
  hitZones: 4,
  motionHitMax: 3,
  motionHitCooldown: 0.2,
});

// 難度分成「怪物數量」與「頭目血量」兩個倍率，讓調整時不會互相綁死。
export const DIFFICULTIES = Object.freeze({
  easy: { countMultiplier: 2 / 3, bossMultiplier: 2 / 3 },
  normal: { countMultiplier: 1, bossMultiplier: 1 },
  hard: { countMultiplier: 5 / 3, bossMultiplier: 4 / 3 },
});

// 頭目圖片與名稱依關卡循環使用；無限模式超過第五關後仍能繼續產生頭目。
export const BOSS_ART = Object.freeze([
  'boss_fat',
  'boss_mummy',
  'boss_pumpkin',
  'boss',
  'boss_final',
]);

// 名稱陣列與 BOSS_ART 使用相同索引，確保畫面素材和播報名稱一致。
export const BOSS_NAMES = Object.freeze([
  '巨胖屍王',
  '木乃伊王',
  '南瓜頭魔王',
  '殭屍大王',
  '終極殭屍王',
]);

// 所有素材路徑都以網頁根目錄為基準，建置後在 src 與 dist 皆能使用相同路徑。
export const ASSET_PATHS = Object.freeze({
  background: './assets/background_lawn.webp',
  normal0: './assets/z_normal.webp',
  normal1: './assets/z_normal2.webp',
  normal0Attack: './assets/z_normal_atk.webp',
  normal1Attack: './assets/z_normal2_atk.webp',
  boss: './assets/z_boss.webp',
  boss_fat: './assets/boss_fat.webp',
  boss_mummy: './assets/boss_mummy.webp',
  boss_pumpkin: './assets/boss_pumpkin.webp',
  boss_final: './assets/boss_final.webp',
  bucket: './assets/z_bucketz.webp',
  bucketDent: './assets/z_bucketz_dent.webp',
  bucketAttack: './assets/z_bucketz_atk.webp',
  bucketDentAttack: './assets/z_bucketz_dent_atk.webp',
  club: './assets/z_club.webp',
  clubAttack: './assets/z_club_atk.webp',
  bomb: './assets/z_bomb.webp',
  dancer: './assets/z_dancer.webp',
  dancerAttack: './assets/z_dancer_atk.webp',
  dog: './assets/z_dog.webp',
  dogAttack: './assets/z_dog_atk.webp',
});

/** 依關卡取得該關頭目的圖片鍵值。 */
export function bossArtForLevel(level) {
  return BOSS_ART[(level - 1) % BOSS_ART.length];
}

/** 依關卡取得顯示在警告橫幅上的頭目名稱。 */
export function bossNameForLevel(level) {
  return BOSS_NAMES[(level - 1) % BOSS_NAMES.length];
}

/**
 * 計算頭目初始血量：計時模式固定成長，無限模式帶少量隨機且設有上限。
 */
export function bossHpForLevel(level, gameMode) {
  if (gameMode === 'endless') {
    const base = Math.min(40, 10 + level * 3);
    return Math.round(base * (0.85 + Math.random() * 0.3));
  }
  return 6 + level * 4;
}

/** 第三關起建立中途頭目的素材、名稱與血量設定。 */
export function miniBossForLevel(level) {
  if (level < 3) return null;
  return {
    artKey: bossArtForLevel(level - 2),
    name: bossNameForLevel(level - 2),
    hp: 8 + (level - 3) * 2,
  };
}

/** 把 0～1 的景深進度換算成 Canvas 上的地面 Y 座標。 */
export function depthY(progress, height) {
  return height * (CONFIG.horizon + (CONFIG.front - CONFIG.horizon) * progress);
}

/** 把景深進度換算成角色高度，越靠近玩家會以非線性方式放大。 */
export function depthScale(progress, height) {
  const range = CONFIG.nearScale - CONFIG.farScale;
  return height * (CONFIG.farScale + range * Math.pow(progress, 1.15));
}
