/**
 * @jest-environment jsdom
 */

import 'babel-polyfill';
import { createCanvas } from 'canvas';
import sinon from 'sinon';
import * as Constants from '../../../Constants';
import { Canvas } from '../../../Core/Canvas';
import { Game } from '../../../Core/Game';

let game;
let canvas;
let canvasElement;
let sandbox;
let event;
let stubGameSkier;

beforeEach(() => {
  sandbox = sinon.createSandbox();
  canvasElement = createCanvas();
  canvasElement.style = {};
  canvas = new Canvas({
    width: Constants.GAME_WIDTH,
    height: Constants.GAME_HEIGHT,
    canvasElement,
  });

  game = new Game({ canvas });

  stubGameSkier = {
    turnLeft: sandbox.stub(game.skier, 'turnLeft'),
    turnRight: sandbox.stub(game.skier, 'turnRight'),
    turnUp: sandbox.stub(game.skier, 'turnUp'),
    turnDown: sandbox.stub(game.skier, 'turnDown'),
    jump: sandbox.stub(game.skier, 'jump'),
  };
  event = {
    preventDefault: sandbox.spy(),
  };
});
afterEach(() => {
  sandbox.restore();
});

test('Can handle key left', () => {
  expect(typeof game.handleKeyDown).toBe('function');
  event.which = Constants.KEYS.LEFT;
  game.handleKeyDown(event);
  expect(event.preventDefault.calledOnce).toBe(true);
  expect(stubGameSkier.turnLeft.calledOnce).toBe(true);
});

test('Can handle key right', () => {
  expect(typeof game.handleKeyDown).toBe('function');
  event.which = Constants.KEYS.RIGHT;
  game.handleKeyDown(event);
  expect(event.preventDefault.calledOnce).toBe(true);
  expect(stubGameSkier.turnRight.calledOnce).toBe(true);
});

test('Can handle key up', () => {
  expect(typeof game.handleKeyDown).toBe('function');
  event.which = Constants.KEYS.UP;
  game.handleKeyDown(event);
  expect(event.preventDefault.calledOnce).toBe(true);
  expect(stubGameSkier.turnUp.calledOnce).toBe(true);
});

test('Can handle key down', () => {
  expect(typeof game.handleKeyDown).toBe('function');
  event.which = Constants.KEYS.DOWN;
  game.handleKeyDown(event);
  expect(event.preventDefault.calledOnce).toBe(true);
  expect(stubGameSkier.turnDown.calledOnce).toBe(true);
});

test('Can handle key jump', () => {
  expect(typeof game.handleKeyDown).toBe('function');
  event.which = Constants.KEYS.JUMP;
  game.handleKeyDown(event);
  expect(event.preventDefault.calledOnce).toBe(true);
  expect(stubGameSkier.jump.calledOnce).toBe(true);
});