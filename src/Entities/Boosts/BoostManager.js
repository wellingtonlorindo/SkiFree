import { Boost } from './Boost';
import { EntityManager } from '../EntityManager';

const DISTANCE_BETWEEN_BOOSTS = 50;
const STARTING_BOOST_GAP = 100;
const STARTING_BOOST_REDUCER = 300;
const NEW_BOOST_CHANCE = 30;

export class BoostManager extends EntityManager {
  boosts = [];

  constructor({ assetManager }) {
    super({ assetManager });
    this.entityClass = Boost;
    this.startingEntityReducer = STARTING_BOOST_REDUCER;
    this.startingEntityGap = STARTING_BOOST_GAP;
    this.newEntityChance = NEW_BOOST_CHANCE;
    this.distanceBetweenEntities = DISTANCE_BETWEEN_BOOSTS;
  }

  getBoosts() {
    return this.boosts;
  }

  drawBoosts(canvas) {
    this.entities = this.getBoosts();
    this.drawEntities(canvas);
  }

  placeNewBoost(gameWindow, previousGameWindow) {
    this.placeNewEntity(gameWindow, previousGameWindow);
  }
}