/**
 * @jest-environment jsdom
 */

import 'babel-polyfill';
import sinon from 'sinon';
import * as Constants from '../../../Constants';
import { AssetManager } from '../../../Core/AssetManager';
import { Boost } from '../../../Entities/Boosts/Boost';
import { Obstacle } from '../../../Entities/Obstacles/Obstacle';
import { Skier } from '../../../Entities/Skier';

let skier;
let sandbox;
let assetManager;
let stubGetSkierBounds;

beforeEach(() => {
  sandbox = sinon.createSandbox();
  assetManager = new AssetManager();
  assetManager.loadAssets(Constants.ASSETS);
  skier = new Skier({ x: 0, y: 0, assetManager });
  sandbox.spy(skier, 'jump');
  sandbox.spy(skier, 'updateAsset');
  sandbox.spy(skier, 'moveSkierLeftDown');
  sandbox.spy(skier, 'moveSkierDown');
  sandbox.spy(skier, 'moveSkierRightDown');
  sandbox.spy(skier, 'checkIfItCanBeJumpedOver');
  sandbox.spy(skier, 'setDirection');
  stubGetSkierBounds = sandbox.stub(skier, 'getSkierBounds');
});
afterEach(() => {
  sandbox.restore();
});

test('Can not set an invalid direction', () => {
  expect(typeof skier.setDirection).toBe('function');
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  skier.setDirection(-10000000);
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  expect(skier.updateAsset.notCalled).toBe(true);
});

test('Set a valid direction', () => {
  expect(typeof skier.setDirection).toBe('function');
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  skier.setDirection(Constants.SKIER_DIRECTIONS.LEFT);
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  expect(skier.updateAsset.calledOnce).toBe(true);
});

test('Can move left down', () => {
  expect(typeof skier.move).toBe('function');
  skier.direction = Constants.SKIER_DIRECTIONS.LEFT_DOWN;
  skier.move();
  expect(skier.moveSkierLeftDown.calledOnce).toBe(true);
});

test('Can move down', () => {
  expect(typeof skier.move).toBe('function');
  skier.direction = Constants.SKIER_DIRECTIONS.DOWN;
  skier.move();
  expect(skier.moveSkierDown.calledOnce).toBe(true);
});

test('Can move left down', () => {
  expect(typeof skier.move).toBe('function');
  skier.direction = Constants.SKIER_DIRECTIONS.RIGHT_DOWN;
  skier.move();
  expect(skier.moveSkierRightDown.calledOnce).toBe(true);
});

test('Skier can jump', async () => {
  expect(typeof skier.jump).toBe('function');

  await skier.jump({ time: 200, number: 1 });
  expect(skier.jump.callCount).toBe(6);
  expect(skier.speed).toBe(Constants.SKIER_STARTING_SPEED);
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  expect(skier.assetName).toBe(Constants.SKIER_DOWN);
});

test('Check if skier hit an obstacle', async () => {
  expect(typeof skier.checkIfSkierHitSomething).toBe('function');

  const obstacle = new Obstacle({ x: 0, y: 0, assetManager });
  const stubSkierTouchedEntities = sandbox
    .stub(skier, 'checkIfSkierTouchedEntities')
    .returns(obstacle);
  skier.checkIfSkierHitSomething([obstacle]);
  expect(stubGetSkierBounds.calledOnce).toBe(true);
  expect(stubSkierTouchedEntities.calledOnce).toBe(true);
  expect(skier.checkIfItCanBeJumpedOver.calledOnce).toBe(true);
  expect(skier.setDirection.calledOnce).toBe(true);
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.CRASH);
});

test('Check if skier hit an boost', async () => {
  expect(typeof skier.checkIfSkierHitSomething).toBe('function');

  const boost = new Boost({ x: 0, y: 0, assetManager });
  const stubSkierTouchedEntities = sandbox
    .stub(skier, 'checkIfSkierTouchedEntities')
    .returns(boost);
  skier.checkIfSkierHitSomething([boost]);
  expect(stubGetSkierBounds.calledOnce).toBe(true);
  expect(stubSkierTouchedEntities.calledOnce).toBe(true);
  expect(skier.setDirection.notCalled).toBe(true);
  expect(skier.jump.calledOnce).toBe(true);
  expect(
    skier.jump.calledWith({
      time: 400,
      speed: Constants.SKIER_JUMP_RAMP_SPEED,
    }),
  ).toBe(true);
});
