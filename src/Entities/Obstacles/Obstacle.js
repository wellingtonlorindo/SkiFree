import * as Constants from '../../Constants';
import { Entity } from '../Entity';
import { randomInt } from '../../Core/Utils';

const assetTypes = [
  Constants.TREE,
  Constants.TREE_CLUSTER,
  Constants.ROCK1,
  Constants.ROCK2,
];

export class Obstacle extends Entity {
  constructor({ x, y, assetManager }) {
    super({ x, y, assetManager });

    const assetIdx = randomInt(0, assetTypes.length - 1);
    this.assetName = assetTypes[assetIdx];
  }

  getType() {
    return Constants.ENTITY_TYPES.OBSTACLE;
  }
}