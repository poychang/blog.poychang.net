import { ASSET_PATHS } from '../game/config.js';

/** 負責預載圖片，並依殭屍種類與動作狀態選出正確素材。 */
export class AssetStore {
  /** 建立素材索引；實際下載會等到 load() 被呼叫。 */
  constructor(paths = ASSET_PATHS) {
    this.paths = paths;
    this.images = {};
    this.ready = false;
  }

  /** 平行載入所有圖片；核心素材失敗時回傳 false，繪圖器會改用幾何圖形。 */
  async load() {
    const jobs = Object.entries(this.paths).map(([key, source]) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = source;
      this.images[key] = image;
    }));

    await Promise.all(jobs);
    this.ready = ['background', 'normal0', 'normal1', 'boss'].every((key) => this.isLoaded(this.images[key]));
    if (!this.ready) console.warn('核心美術載入失敗，將使用簡易圖形替代。');
    return this.ready;
  }

  /** 以設定中的鍵值取得 Image 物件。 */
  get(key) {
    return this.images[key];
  }

  /** 確認圖片已完成解碼且有有效尺寸。 */
  isLoaded(image) {
    return Boolean(image?.naturalWidth);
  }

  /** 根據種類、桶子凹陷狀態與攻擊姿勢，挑選這一幀要畫的角色圖片。 */
  imageForZombie(zombie) {
    const attacking = zombie.state === 'attack' && zombie.lungeTime > 0;

    if (zombie.boss || zombie.miniBoss) {
      const selectedBoss = this.get(zombie.bossArtKey);
      return this.isLoaded(selectedBoss) ? selectedBoss : this.get('boss');
    }
    if (zombie.type === 'bucket') {
      if (zombie.bucketDented) {
        if (attacking && this.isLoaded(this.get('bucketDentAttack'))) return this.get('bucketDentAttack');
        if (this.isLoaded(this.get('bucketDent'))) return this.get('bucketDent');
      }
      if (attacking && this.isLoaded(this.get('bucketAttack'))) return this.get('bucketAttack');
      return this.isLoaded(this.get('bucket')) ? this.get('bucket') : this.normalImage(zombie, attacking);
    }
    if (zombie.club) return attacking && this.isLoaded(this.get('clubAttack')) ? this.get('clubAttack') : this.get('club');
    if (zombie.dancer) return attacking && this.isLoaded(this.get('dancerAttack')) ? this.get('dancerAttack') : this.get('dancer');
    if (zombie.tiny) return attacking && this.isLoaded(this.get('dogAttack')) ? this.get('dogAttack') : this.get('dog');
    return this.normalImage(zombie, attacking);
  }

  /** 一般殭屍有兩種外觀，且各自有走路與攻擊版本。 */
  normalImage(zombie, attacking) {
    if (zombie.art === 'normal1') {
      return attacking && this.isLoaded(this.get('normal1Attack')) ? this.get('normal1Attack') : this.get('normal1');
    }
    return attacking && this.isLoaded(this.get('normal0Attack')) ? this.get('normal0Attack') : this.get('normal0');
  }
}
