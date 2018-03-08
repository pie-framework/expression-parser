import { parser } from '../simple-grammar';
import { tokenize } from '../tokens';
import { interpreter } from '../simple-interpreter';
describe('test', () => {

  const assert = (input: string, expected: number) => {


    it(`${input} -> ${expected}`, () => {
      const r = tokenize(input);
      parser.input = r.tokens;
      // console.log(' >> r.tokens', r.tokens);
      // console.log(' >> parser.errors', parser.errors);
      const result = parser.expression();
      // console.log(' >> result', JSON.stringify(result, null, '  '));
      // console.log(' >> parser.errors', parser.errors);

      const out = interpreter.visit(result);
      console.log('out: ', out);

      expect(out).toEqual(expected);

    });
  }

  // assert('1-2', -1);
  assert('1 -2', -1);
  // assert('1 - 2', -1);
  // assert('1 2', 2);

  // assert('1(1)', 1);
  // assert('(1)(1)', 1);
  // assert('(2)pi', Math.PI * 2);
  // assert('01', 1);
  // assert('1', 1);
  // assert('-1', -1);
  // assert('11.', 11);
  // assert('11.01', 11.01);
  // assert('11.123456789', 11.123456789);
  // assert('11.0', 11);
  // assert('11.1', 11.1);
  // assert('11.10', 11.1);
  // assert('-11.1', -11.1);
  // assert('.2', 0.2);
  // assert('-.2', -0.2);
  // assert('1 + 1', 2);
  // assert('1 - -2', 3);
  // assert('-1 * 10', -10);
  // assert('-.1 * 10', -1);
  // assert('-1 - -2', 1);
  // assert('-1 - -2 * -3', -7);
  // assert('-1 - -2 * -3 + 6 / 2', -4);
  // assert('(-1 - -2) * (-3 + 6) / 2', 1.5);
  // assert('(1 +2)', 3);
  // assert('(1 *2)', 2);
  // assert('1 - 2', -1);
  // assert('1-2', -1);
  // assert('(1+1)(1+1)', 4);
  // assert('1 * 2 * 3', 6);
  // assert('2 3', 6);
  // assert('23', 23);
  // assert('2 * 3', 6);
  // assert('2 * 3 + 1', 7);
  // assert('(1/2)', 0.5);
  // assert('5(2)', 10);
  // assert('5(2(2))', 20);
})