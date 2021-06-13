import * as Constants from './Constants';

export const KeyDownActions = {
  execute: (game, event) => {
    const key = event.which;
    const executeAction = KeyDownActions[key] || null;
    if (!executeAction) {
      return;
    }
    executeAction(game.skier);
    event.preventDefault();
  },
  [Constants.KEYS.LEFT]: (skier) => {
    skier.turnLeft();
  },
  [Constants.KEYS.RIGHT]: (skier) => {
    skier.turnRight();
  },
  [Constants.KEYS.UP]: (skier) => {
    skier.turnUp();
  },
  [Constants.KEYS.DOWN]: (skier) => {
    skier.turnDown();
  },
  [Constants.KEYS.JUMP]: (skier) => {
    skier.jump();
  },
};

export const SkierDirectionActions = {
  execute: (skier) => {
    const executeAction = SkierDirectionActions[skier.direction] || null;
    if (!executeAction) {
      return;
    }
    executeAction(skier);
  },
  [Constants.SKIER_DIRECTIONS.LEFT_DOWN]: (skier) => {
    skier.moveSkierLeftDown();
  },
  [Constants.SKIER_DIRECTIONS.DOWN]: (skier) => {
    skier.moveSkierDown();
  },
  [Constants.SKIER_DIRECTIONS.RIGHT_DOWN]: (skier) => {
    skier.moveSkierRightDown();
  },
};

export const SkierHitActions = {
  execute: (skier, entity) => {
    const executeAction = SkierHitActions[entity.getType()] || null;
    if (!executeAction) {
      return;
    }
    executeAction(skier, entity);
  },
  [Constants.ENTITY_TYPES.OBSTACLE]: (skier, obstacle) => {
    if (skier.checkIfItCanBeJumpedOver(obstacle)) {
      return;
    }

    skier.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
  },
  [Constants.ENTITY_TYPES.BOOST]: (skier, boost) => {
    if (boost.getAssetName() === Constants.JUMP_RAMP) {
      skier.jump({
        time: 400,
        speed: Constants.SKIER_JUMP_RAMP_SPEED,
      });
    }
  },
};
