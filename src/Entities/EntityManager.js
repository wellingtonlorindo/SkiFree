import * as Constants from '../Constants';
import { randomInt } from '../Core/Utils';

export class EntityManager {
  entities = [];

  distanceBetweenEntities;

  startingEntityGap;

  startingEntityReducer;

  newEntityChance;

  entityClass;

  constructor({ assetManager }) {
    this.assetManager = assetManager;
  }

  drawEntities(canvas) {
    this.entities.forEach((entity) => {
      entity.draw(canvas);
    });
  }

  placeInitialEntities() {
    const numberEntities = Math.ceil(
      (Constants.GAME_WIDTH / this.startingEntityReducer) *
        (Constants.GAME_HEIGHT / this.startingEntityReducer),
    );

    const minX = -Constants.GAME_WIDTH / 2;
    const maxX = Constants.GAME_WIDTH / 2;
    const minY = this.startingEntityGap;
    const maxY = Constants.GAME_HEIGHT / 2;

    for (let i = 0; i < numberEntities; i += 1) {
      this.placeRandomEntity(minX, maxX, minY, maxY);
    }

    this.entities.sort(
      (entity1, entity2) => entity1.getPosition().y - entity2.getPosition().y,
    );
  }

  placeNewEntity(gameWindow, previousGameWindow) {
    const shouldPlaceEntity = randomInt(1, this.newEntityChance);
    if (shouldPlaceEntity !== this.newEntityChance) {
      return;
    }

    if (!previousGameWindow) {
      this.placeEntityLeft(gameWindow);
      return;
    }

    if (gameWindow.left < previousGameWindow.left) {
      this.placeEntityLeft(gameWindow);
    } else if (gameWindow.left > previousGameWindow.left) {
      this.placeEntityRight(gameWindow);
    }

    if (gameWindow.top < previousGameWindow.top) {
      this.placeEntityTop(gameWindow);
    } else if (gameWindow.top > previousGameWindow.top) {
      this.placeEntityBottom(gameWindow);
    }
  }

  placeEntityLeft(gameWindow) {
    this.placeRandomEntity(
      gameWindow.left,
      gameWindow.left,
      gameWindow.top,
      gameWindow.bottom,
    );
  }

  placeEntityRight(gameWindow) {
    this.placeRandomEntity(
      gameWindow.right,
      gameWindow.right,
      gameWindow.top,
      gameWindow.bottom,
    );
  }

  placeEntityTop(gameWindow) {
    this.placeRandomEntity(
      gameWindow.left,
      gameWindow.right,
      gameWindow.top,
      gameWindow.top,
    );
  }

  placeEntityBottom(gameWindow) {
    this.placeRandomEntity(
      gameWindow.left,
      gameWindow.right,
      gameWindow.bottom,
      gameWindow.bottom,
    );
  }

  placeRandomEntity(minX, maxX, minY, maxY) {
    const position = this.calculateOpenPosition(minX, maxX, minY, maxY);
    const EntityClass = this.entityClass;
    const newEntity = new EntityClass({
      x: position.x,
      y: position.y,
      assetManager: this.assetManager,
    });
    this.entities.push(newEntity);
  }

  calculateOpenPosition(minX, maxX, minY, maxY) {
    const x = randomInt(minX, maxX);
    const y = randomInt(minY, maxY);

    const foundCollision = this.entities.find(
      (entity) =>
        x > entity.x - this.distanceBetweenEntities &&
        x < entity.x + this.distanceBetweenEntities &&
        y > entity.y - this.distanceBetweenEntities &&
        y < entity.y + this.distanceBetweenEntities,
    );

    if (foundCollision) {
      return this.calculateOpenPosition(minX, maxX, minY, maxY);
    }

    return {
      x,
      y,
    };
  }
}
