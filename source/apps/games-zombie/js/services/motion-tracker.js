/**
 * 封裝 Webcam 與影格差分演算法。
 * 遊戲核心只需要詢問某個畫面區域有多少變動，不必理解攝影機像素細節。
 */
export class MotionTracker {
  /** 建立低解析度處理畫布；低解析度可大幅降低每幀掃描成本。 */
  constructor(video, config) {
    this.video = video;
    this.config = config;
    this.ready = false;
    this.mirror = true;
    this.rotation = 0;
    this.sensitivity = 12;
    this.previousGray = null;
    this.motion = new Float32Array(config.processWidth * config.processHeight);

    this.processingCanvas = document.createElement('canvas');
    this.processingCanvas.width = config.processWidth;
    this.processingCanvas.height = config.processHeight;
    this.processingContext = this.processingCanvas.getContext('2d', { willReadFrequently: true });
  }

  /** 向瀏覽器要求前鏡頭權限並開始播放；已啟動時不重複取得串流。 */
  async startCamera() {
    if (this.ready) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('這個瀏覽器不支援攝影機存取');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      audio: false,
    });
    this.video.srcObject = stream;
    await this.video.play();
    this.ready = true;
  }

  /** 清空上一幀與動作遮罩，避免新一局把舊畫面誤判成揮動。 */
  reset() {
    this.previousGray = null;
    this.motion.fill(0);
  }

  /**
   * 以 cover 模式繪製攝影機，並套用玩家設定的鏡像與 90 度旋轉校正。
   */
  drawCamera(context, width, height) {
    if (!this.ready || this.video.readyState < 2) return;
    const sourceWidth = this.video.videoWidth || width;
    const sourceHeight = this.video.videoHeight || height;
    const turnsSideways = this.rotation === 90 || this.rotation === 270;
    const targetWidth = turnsSideways ? height : width;
    const targetHeight = turnsSideways ? width : height;
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = targetWidth / targetHeight;
    let drawWidth;
    let drawHeight;

    if (sourceRatio > targetRatio) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * sourceRatio;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / sourceRatio;
    }

    context.save();
    context.translate(width / 2, height / 2);
    if (this.mirror) context.scale(-1, 1);
    context.rotate(this.rotation * Math.PI / 180);
    context.drawImage(this.video, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    context.restore();
  }

  /**
   * 將目前畫面轉成灰階並與上一幀比較；超過像素差門檻的位置記為 1。
   */
  detect() {
    if (!this.ready || this.video.readyState < 2) return;
    const width = this.config.processWidth;
    const height = this.config.processHeight;
    this.drawCamera(this.processingContext, width, height);
    const rgba = this.processingContext.getImageData(0, 0, width, height).data;
    const gray = new Uint8ClampedArray(width * height);

    for (let source = 0, target = 0; source < rgba.length; source += 4, target += 1) {
      gray[target] = (rgba[source] * 0.299 + rgba[source + 1] * 0.587 + rgba[source + 2] * 0.114) | 0;
    }

    if (this.previousGray) {
      for (let index = 0; index < gray.length; index += 1) {
        this.motion[index] = Math.abs(gray[index] - this.previousGray[index]) > this.config.pixelDifference ? 1 : 0;
      }
    } else {
      this.motion.fill(0);
    }
    this.previousGray = gray;
  }

  /**
   * 統計遊戲座標附近的變動像素數，作為殭屍或炸彈是否被揮中的依據。
   */
  motionAt(gameX, gameY, radiusX, radiusY, viewportWidth, viewportHeight) {
    const width = this.config.processWidth;
    const height = this.config.processHeight;
    const centerX = Math.round(gameX / viewportWidth * width);
    const centerY = Math.round(gameY / viewportHeight * height);
    const rx = radiusX || 2;
    const ry = radiusY || rx;
    let total = 0;

    for (let y = centerY - ry; y <= centerY + ry; y += 1) {
      if (y < 0 || y >= height) continue;
      for (let x = centerX - rx; x <= centerX + rx; x += 1) {
        if (x >= 0 && x < width) total += this.motion[y * width + x];
      }
    }
    return total;
  }
}
