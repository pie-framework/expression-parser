import { calculate, AngleMode } from '..';
import { sin, cos, tan, asin, acos, atan } from '../math-utils';
import debug from 'debug';
const log = debug('expression-grammar:test');

const { DEGREES, RADIANS } = AngleMode;

describe('calculate', () => {

  const a = (only) => (
    expr: string,
    v: number,
    opts: { angleMode: AngleMode } = { angleMode: RADIANS }) => {

    const fn = only ? it.only : it;

    fn(`${opts.angleMode === DEGREES ? '[D]' : '[R]'} ${expr} = ${v}`, () => {
      const result = calculate(expr, opts);
      log('>>>', result);
      expect(result.value).toEqual(v);
    });
  }

  const assert = a(false);
  const assertOnly = a(true);

  const assertError = (expr: string) => {
    it(`${expr} == Error`, () => {
      const result = calculate(expr, { angleMode: RADIANS });
      expect(result.error).toBeDefined();
    });
  }

  describe('errors', () => {
    assertError('foo');
  });

  describe('number', () => {
    assert('-10', -10);
    assert('-.1', -0.1);
    assert('1.', 1);
    assert('1.0', 1);
    assert('1.1234567', 1.1234567);
  });

  describe('angle', () => {

    describe('sin', () => {
      assert('sin(10)', sin(10, RADIANS));
      assert('sin(5+2+3)', sin(10, RADIANS));
      assert('sin(30)', sin(30, RADIANS));
      assert('sin(30)', 0.5, { angleMode: DEGREES });
      assert('sin(90)', 1, { angleMode: DEGREES });
      assert('sin(120)', sin(120, DEGREES), { angleMode: DEGREES });
    });

    describe('cos', () => {
      assert('cos(10)', cos(10, RADIANS));
      assert('cos(10)', cos(10, DEGREES), { angleMode: DEGREES });
    });

    describe('tan', () => {
      assert('tan(10)', tan(10, RADIANS));
      assert('tan(10)', tan(10, DEGREES), { angleMode: DEGREES });
    });
    describe('asin', () => {
      assert('asin(1)', asin(1, DEGREES), { angleMode: DEGREES });
      assert('asin(10)', asin(10, RADIANS));
      assert('asin(90)', asin(90, DEGREES), { angleMode: DEGREES });
    });
    describe('acos', () => {
      assert('acos(10)', acos(10, RADIANS));
      assert('acos(10)', acos(10, DEGREES), { angleMode: DEGREES });
    });
    describe('atan', () => {
      assert('atan(10)', atan(10, RADIANS));
      assert('atan(10)', atan(10, DEGREES), { angleMode: DEGREES });
    });
  });

  describe('decimal', () => {
    assert('10.12', 10.12);

    it('bad decimal place', () => {
      const result = calculate('10.1.1');
      expect(result.error).toBeDefined();
    });
  });

  describe('%', () => {
    assert('10%', 0.1);
    assert('10% + 2', 2.1);
    assert('10% * 2', 0.2);
  });

  describe('addition', () => {
    assert('10.1 + 10.44', 20.54);
    assert('10 + 1.223399', 11.223399);
    assert('(10% * 100) + 1.2', 11.2);
    assert('(100 ÷ 10) + 1.2', 11.2);
  });

  describe('log', () => {
    assert('log(10% * 2)', Math.log10(0.2));
    assert('log(10)', 1);
    const log = Math.log10(10);
    assert('log(10)', log);
  });

  describe('ln', () => {
    assert('ln(10)', Math.log(10));
  });

  describe('sqrt', () => {
    assert('√(10% * 40)', 2);
    assert('√(4)', 2);
    assert('³√(8)', 2);
    assert('⁴√(16)', 2);
    assert('¹⁰√(100)', Math.pow(100, 1 / 10));
  });

  describe('factorial', () => {
    assert('3!', 6);
    assert('10!', 3628800);
  });

  describe('abs', () => {
    assert('abs(-10)', 10);
    assert('abs(10-20)', 10);
    assert('abs(20 * 50%)', 10);
    assert('abs(10% * -100)', 10);
  });

  describe('square', () => {
    assert('2⁴', 16);
    assert('2¹⁰', 1024);
  });

  describe('constants', () => {
    describe('pi', () => {
      assert('2 * π', 2 * Math.PI);
      //TODO: assert('2π').value).toEqual(2 * Math.PI);
    });

    describe('euler', () => {
      assert('e', Math.E);
      assert('e * 10', Math.E * 10);
    });
  });

  describe('operator priority', () => {
    assert('1 + 2 * 3', 7);
    assert('(1 + 2) * 3', 9);
    assert('((((666))))', 666);
  });

  describe('power', () => {
    assert('1 + power(2,2)', 5);
  });
})