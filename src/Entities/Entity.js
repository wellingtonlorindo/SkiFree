export class Entity {
  x = 0;

  y = 0;

  assetName = '';

  assetManager;

  constructor({ x, y, assetManager }) {
    this.x = x;
    this.y = y;
    this.assetManager = assetManager;
  }

  getAssetName() {
    return this.assetName;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  draw(canvas) {
    const asset = this.assetManager.getAsset(this.assetName);
    const drawX = this.x - asset.width / 2;
    const drawY = this.y - asset.height / 2;

    canvas.drawImage(asset, drawX, drawY, asset.width, asset.height);
  }
}
