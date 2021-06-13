import * as Constants from '../Constants';
import { AssetManager } from './AssetManager';
import { Canvas } from './Canvas';
import { Skier } from '../Entities/Skier';
import { ObstacleManager } from '../Entities/Obstacles/ObstacleManager';
import { BoostManager } from '../Entities/Boosts/BoostManager';
import { Rect } from './Utils';
import { KeyDownActions } from '../EnumActions';

export class Game {
  gameWindow = null;

  constructor({
    assetManager,
    canvas,
    skier,
    obstacleManager,
    boostManager,
    windowDocument,
  } = {}) {
    this.assetManager = assetManager || this.createAssetManager();
    this.canvas = canvas || this.createCanvas();
    this.skier = skier || this.createSkier();
    this.obstacleManager = obstacleManager || this.createObstacleManager();
    this.boostManager = boostManager || this.createBoostManager();
    this.windowDocument = windowDocument || document;

    this.windowDocument.addEventListener(
      'keydown',
      this.handleKeyDown.bind(this),
    );
  }

  createAssetManager() {
    return new AssetManager();
  }

  createCanvas() {
    return new Canvas({
      width: Constants.GAME_WIDTH,
      height: Constants.GAME_HEIGHT,
    });
  }

  createSkier() {
    return new Skier({ x: 0, y: 0, assetManager: this.assetManager });
  }

  createObstacleManager() {
    return new ObstacleManager({ assetManager: this.assetManager });
  }

  createBoostManager() {
    return new BoostManager({ assetManager: this.assetManager });
  }

  init() {
    this.obstacleManager.placeInitialObstacles();
  }

  async load() {
    await this.assetManager.loadAssets(Constants.ASSETS);
  }

  run() {
    this.canvas.clearCanvas();

    this.updateGameWindow();
    this.drawGameWindow();

    requestAnimationFrame(this.run.bind(this));
  }

  updateGameWindow() {
    this.skier.move();

    const previousGameWindow = this.gameWindow;
    this.calculateGameWindow();

    this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);
    this.boostManager.placeNewBoost(this.gameWindow, previousGameWindow);

    const obstacles = this.obstacleManager.getObstacles();
    const boots = this.boostManager.getBoosts();
    const entities = obstacles.concat(boots);
    this.skier.checkIfSkierHitSomething(entities, this.assetManager);
  }

  drawGameWindow() {
    this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

    this.skier.draw(this.canvas, this.assetManager);
    this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    this.boostManager.drawBoosts(this.canvas, this.assetManager);
  }

  calculateGameWindow() {
    const skierPosition = this.skier.getPosition();
    const left = skierPosition.x - Constants.GAME_WIDTH / 2;
    const top = skierPosition.y - Constants.GAME_HEIGHT / 2;

    this.gameWindow = new Rect(
      left,
      top,
      left + Constants.GAME_WIDTH,
      top + Constants.GAME_HEIGHT,
    );
  }

  handleKeyDown(event) {
    KeyDownActions.execute(this, event);
  }
}
