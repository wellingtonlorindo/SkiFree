import * as Constants from '../Constants';
import { SkierDirectionActions, SkierHitActions } from '../EnumActions';
import { Entity } from './Entity';
import { intersectTwoRects, Rect, sleep } from '../Core/Utils';

export class Skier extends Entity {
  assetName = Constants.SKIER_DOWN;

  direction = Constants.SKIER_DIRECTIONS.DOWN;

  speed = Constants.SKIER_STARTING_SPEED;

  constructor({ x, y, assetManager }) {
    super({ x, y, assetManager });
  }

  getType() {
    return Constants.ENTITY_TYPES.SKIER;
  }

  setDirection(direction) {
    if (!Constants.SKIER_DIRECTION_ASSET[direction]) {
      return;
    }
    this.direction = direction;
    this.updateAsset();
  }

  updateAsset() {
    this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
  }

  move() {
    SkierDirectionActions.execute(this);
  }

  moveSkierLeft() {
    this.x -= Constants.SKIER_STARTING_SPEED;
  }

  moveSkierLeftDown() {
    this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
  }

  moveSkierDown() {
    this.y += this.speed;
  }

  moveSkierRightDown() {
    this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
  }

  moveSkierRight() {
    this.x += Constants.SKIER_STARTING_SPEED;
  }

  moveSkierUp() {
    this.y -= Constants.SKIER_STARTING_SPEED;
  }

  turnLeft() {
    if (this.direction === Constants.SKIER_DIRECTIONS.LEFT) {
      this.moveSkierLeft();
    } else {
      this.setDirection(this.direction - 1);
    }
  }

  turnRight() {
    if (this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
      this.moveSkierRight();
    } else {
      this.setDirection(this.direction + 1);
    }
  }

  turnUp() {
    if (
      this.direction === Constants.SKIER_DIRECTIONS.LEFT ||
      this.direction === Constants.SKIER_DIRECTIONS.RIGHT
    ) {
      this.moveSkierUp();
    }
  }

  turnDown() {
    this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
  }

  async jump({ time = 200, number = 1, speed } = {}) {
    const jump = Constants.SKIER_JUMPS[`JUMP${number}`];
    if (!jump) {
      this.speed = Constants.SKIER_STARTING_SPEED;
      return this.updateAsset();
    }
    if (speed) {
      this.speed = speed;
    }

    this.assetName = Constants.SKIER_JUMP_ASSET[jump];
    await sleep(time);
    return this.jump({
      time,
      number: number + 1,
      speed,
    });
  }

  checkIfItCanBeJumpedOver(obstacle) {
    const checkSkier = Object.values(Constants.SKIER_JUMP_ASSET).includes(
      this.getAssetName(),
    );
    const checkObstacle = Constants.SKIER_CAN_JUMP_OVER_ASSETS.includes(
      obstacle.getAssetName(),
    );

    return checkSkier && checkObstacle;
  }

  createSkierBounds(asset) {
    const skierBounds = this.createRect({
      x: this.x - asset.width / 2,
      y: this.y - asset.height / 2,
      width: this.x + asset.width / 2,
      height: this.y - asset.height / 4,
    });

    return skierBounds;
  }

  createRect({ x, y, width, height }) {
    return new Rect(x, y, width, height);
  }

  checkIfSkierTouchedEntities(skierBounds, entities) {
    const self = this;
    return entities.find((entity) => {
      const entityAsset = self.assetManager.getAsset(entity.getAssetName());
      const entityPosition = entity.getPosition();
      const entityBounds = self.createRect({
        x: entityPosition.x - entityAsset.width / 2,
        y: entityPosition.y - entityAsset.height / 2,
        width: entityPosition.x + entityAsset.width / 2,
        height: entityPosition.y,
      });

      return intersectTwoRects(skierBounds, entityBounds);
    });
  }

  getSkierBounds() {
    const asset = this.assetManager.getAsset(this.getAssetName());
    if (!asset) {
      throw new Error('Asset not found.');
    }
    return this.createSkierBounds(asset);
  }

  checkIfSkierHitSomething(entities) {
    const skierBounds = this.getSkierBounds();
    const entityTouched = this.checkIfSkierTouchedEntities(
      skierBounds,
      entities,
    );

    if (entityTouched) {
      SkierHitActions.execute(this, entityTouched);
    }
  }
}
