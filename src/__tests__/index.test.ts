import { calculate } from '..';

describe('calculate', () => {

  const a = (only) => (expr: string, v: number) => {

    const fn = only ? it.only : it;

    fn(`${expr} = ${v}`, () => {
      const result = calculate(expr);
      expect(result.value).toEqual(v);
    });
  }

  const assert = a(false);
  const assertOnly = a(true);


  describe('decimal', () => {
    assert('10.12', 10.12);

    it('bad decimal place', () => {
      const result = calculate('10.1.1');
      expect(result.parseErrors.length).toEqual(1);
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
    assert('log(10% * 2)', Math.log(0.2));
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

  describe('square', () => {
    assert('2⁴', 16);
    assert('2¹⁰', 1024);
  });

  describe('pi', () => {
    assert('2 * π', 2 * Math.PI);
    //TODO: assert('2π').value).toEqual(2 * Math.PI);
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