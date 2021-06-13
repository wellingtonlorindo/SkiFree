import * as Constants from '../../Constants';
import { Entity } from '../Entity';
import { randomInt } from '../../Core/Utils';

const assetTypes = [Constants.JUMP_RAMP];

export class Boost extends Entity {
  constructor({ x, y, assetManager }) {
    super({ x, y, assetManager });

    const assetIdx = randomInt(0, assetTypes.length - 1);
    this.assetName = assetTypes[assetIdx];
  }

  getType() {
    return Constants.ENTITY_TYPES.BOOST;
  }
}
