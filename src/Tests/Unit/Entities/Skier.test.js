/**
 * @jest-environment jsdom
 */

import "babel-polyfill";
import * as Constants from '../../../Constants';
import { Skier } from '../../../Entities/Skier';

let skier;

beforeEach(() => {
  skier = new Skier(0, 0);
});

test('Can not set an invalid direction', () => {
  expect(typeof skier.setDirection).toBe('function');
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  skier.setDirection(-10000000);
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
});

test('Set a valid direction', () => {
  expect(typeof skier.setDirection).toBe('function');
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  skier.setDirection(Constants.SKIER_DIRECTIONS.LEFT);
  expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
});