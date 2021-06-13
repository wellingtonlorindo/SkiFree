import { Obstacle } from './Obstacle';
import { EntityManager } from '../EntityManager';

const DISTANCE_BETWEEN_OBSTACLES = 50;
const STARTING_OBSTACLE_GAP = 100;
const STARTING_OBSTACLE_REDUCER = 300;
const NEW_OBSTACLE_CHANCE = 8;

export class ObstacleManager extends EntityManager {
  obstacles = [];

  constructor({ assetManager }) {
    super({ assetManager });
    this.entityClass = Obstacle;
    this.startingEntityReducer = STARTING_OBSTACLE_REDUCER;
    this.startingEntityGap = STARTING_OBSTACLE_GAP;
    this.newEntityChance = NEW_OBSTACLE_CHANCE;
    this.distanceBetweenEntities = DISTANCE_BETWEEN_OBSTACLES;
  }

  getObstacles() {
    return this.obstacles;
  }

  drawObstacles(canvas) {
    this.entities = this.getObstacles();
    this.drawEntities(canvas);
  }

  placeInitialObstacles() {
    this.placeInitialEntities();
    this.obstacles = this.entities;
  }

  placeNewObstacle(gameWindow, previousGameWindow) {
    this.placeNewEntity(gameWindow, previousGameWindow);
  }
}
