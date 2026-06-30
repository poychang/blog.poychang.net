/**
 * 使用 Web Audio 即時合成音效與背景音樂，避免額外載入音訊檔。
 * 同時包裝瀏覽器語音合成，讓關卡與結算能以中文播報。
 */
export class AudioManager {
  /** 初始化旋律、低音音階與音樂播放狀態。 */
  constructor() {
    this.context = null;
    this.musicOn = true;
    this.musicTimer = null;
    this.musicStep = 0;
    this.melody = [440, 0, 392, 0, 349, 0, 330, 0, 440, 0, 523, 0, 330, 0, 0, 0];
    this.bass = [110, 0, 0, 0, 87, 0, 0, 0, 110, 0, 0, 0, 82, 0, 0, 0];
  }

  /** 延後到使用者互動後才建立或喚醒 AudioContext，以符合瀏覽器自動播放政策。 */
  ensureContext() {
    if (!this.context) {
      try {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (this.context.state === 'suspended') this.context.resume().catch(() => {});
    return this.context;
  }

  /** 產生一個可設定波形、音量與滑音的短音符，是所有音效的底層工具。 */
  beep(frequency, duration, type = 'square', volume = 0.18, slideTo = null) {
    const context = this.ensureContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, context.currentTime + duration);
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  // 下列方法把常用事件包成具名音效，遊戲規則不必處理振盪器細節。
  /** 一般命中殭屍。 */
  hit() { this.beep(520, 0.1, 'square', 0.2, 180); this.beep(220, 0.12, 'sawtooth', 0.12); }
  /** 連擊越高，提示音音高也越高。 */
  combo(value) { this.beep(600 + Math.min(value, 8) * 80, 0.1, 'triangle', 0.18); }
  /** 命中金屬桶或頭目護盾。 */
  clang() { this.beep(900, 0.05, 'square', 0.2, 520); this.beep(320, 0.12, 'square', 0.12); }
  /** 玩家受到傷害。 */
  hurt() { this.beep(140, 0.3, 'sawtooth', 0.22, 60); }
  /** 頭目登場的低頻警告。 */
  boss() { this.beep(120, 0.5, 'sawtooth', 0.28, 70); setTimeout(() => this.beep(90, 0.6, 'sawtooth', 0.24, 55), 220); }
  /** 炸彈桶爆炸。 */
  bomb() { this.beep(90, 0.5, 'sawtooth', 0.3, 40); this.beep(240, 0.3, 'square', 0.2, 60); }
  /** 生命耗盡或手動結束。 */
  gameOver() { this.beep(330, 0.2, 'square', 0.2, 120); setTimeout(() => this.beep(220, 0.4, 'square', 0.2, 80), 160); }
  /** 依序播放四個上行音符，表示完成第五關。 */
  win() {
    [523, 659, 784, 1047].forEach((note, index) => {
      setTimeout(() => this.beep(note, index === 3 ? 0.3 : 0.12, 'triangle', index === 3 ? 0.22 : 0.2), index * 130);
    });
  }

  /** 啟動固定節拍計時器；重複呼叫不會建立第二個 timer。 */
  startMusic() {
    this.ensureContext();
    if (!this.musicTimer) this.musicTimer = setInterval(() => this.musicTick(), 235);
  }

  /** 依目前步數播放旋律與低音，並前進到下一個節拍。 */
  musicTick() {
    if (!this.musicOn) return;
    const melody = this.melody[this.musicStep % this.melody.length];
    const bass = this.bass[this.musicStep % this.bass.length];
    if (melody) this.beep(melody, 0.2, 'triangle', 0.045);
    if (bass) this.beep(bass, 0.26, 'sine', 0.06);
    this.musicStep += 1;
  }

  /** 切換音樂與語音總開關，回傳新的開關狀態供按鈕更新。 */
  toggleMusic() {
    this.musicOn = !this.musicOn;
    if (this.musicOn) this.startMusic();
    return this.musicOn;
  }

  /** 尋找繁體或中文語音並播報；系統沒有中文語音時直接略過。 */
  say(text) {
    try {
      if (!this.musicOn || !window.speechSynthesis) return;
      const voices = speechSynthesis.getVoices();
      const voice = voices.find((item) => /zh.?TW|zh.?Hant|Taiwan/i.test(`${item.lang} ${item.name}`))
        || voices.find((item) => /zh|cmn|chinese|hans/i.test(`${item.lang} ${item.name}`));
      if (!voice) return;
      const utterance = new SpeechSynthesisUtterance(text);
      Object.assign(utterance, { voice, lang: voice.lang || 'zh-TW', rate: 1.05, pitch: 1.1, volume: 0.95 });
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch {
      // Speech is an optional enhancement.
    }
  }
}
