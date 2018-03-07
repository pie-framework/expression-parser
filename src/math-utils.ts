import { AngleMode } from './angle-mode';
import debug from 'debug';
const log = debug('expression-parser:math-utils');

const { DEGREES, RADIANS } = AngleMode;

export const factorialLoop = (num: number): number => {
  var result = 1;
  for (var i = 1; i < num; i++) {
    result = (result * (i + 1));
  }
  return result;
}

export type AngleFunction = (n: number, mode: AngleMode) => number;

export const toRadians = (degrees: number) => degrees * Math.PI / 180;

const angleFn = (label: string, fn: (n: number) => number) => (input: number, mode: AngleMode): number => {
  log('[angleFn] ', label, ' input: ', input, 'mode: ', mode, ' DEGREES: ', DEGREES);
  const angle = mode === DEGREES ? toRadians(input) : input;
  return parseFloat(fn(angle).toFixed(14));
};

// --
export const sin: AngleFunction = angleFn('sin', Math.sin);
export const cos: AngleFunction = angleFn('cos', Math.cos);
export const tan: AngleFunction = angleFn('tan', Math.tan);

// --
export const asin: AngleFunction = angleFn('asin', Math.asin);
export const acos: AngleFunction = angleFn('acos', Math.acos);
export const atan: AngleFunction = angleFn('atan', Math.atan);
