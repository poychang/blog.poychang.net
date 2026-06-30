const SCORE_KEY = 'hz_scores';
const CALIBRATION_KEY = 'hz_calib';

/** 讀取、正規化並依高到低回傳本機前 20 筆分數。 */
export function getScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]') || [];
    return parsed
      .map((entry) => typeof entry === 'number' ? { score: entry, date: '' } : { score: entry.s, date: entry.d || '' })
      .filter((entry) => typeof entry.score === 'number')
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  } catch {
    return [];
  }
}

/** 加入一筆有日期的分數，重新排序後寫回 localStorage。 */
export function addScore(score) {
  const scores = getScores();
  if (score > 0) scores.push({ score, date: new Date().toISOString().slice(0, 10) });
  scores.sort((a, b) => b.score - a.score);
  scores.length = Math.min(20, scores.length);
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores.map((entry) => ({ s: entry.score, d: entry.date }))));
  } catch {
    // Private browsing can reject storage writes; the game remains playable.
  }
  return scores;
}

/** 讀取鏡像、旋轉與靈敏度；資料無效時個別回退到預設值。 */
export function loadCalibration(defaults) {
  try {
    const stored = JSON.parse(localStorage.getItem(CALIBRATION_KEY) || '{}');
    return {
      mirror: typeof stored.mirror === 'boolean' ? stored.mirror : defaults.mirror,
      rotation: [0, 90, 180, 270].includes(stored.camRot) ? stored.camRot : defaults.rotation,
      sensitivity: typeof stored.sensitivity === 'number' && stored.sensitivity >= 2
        ? stored.sensitivity
        : defaults.sensitivity,
    };
  } catch {
    return defaults;
  }
}

/** 儲存攝影機校正；瀏覽器拒絕 localStorage 時靜默略過。 */
export function saveCalibration({ mirror, rotation, sensitivity }) {
  try {
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify({ mirror, camRot: rotation, sensitivity }));
  } catch {
    // Calibration persistence is optional.
  }
}
