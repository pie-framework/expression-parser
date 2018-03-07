import { tokenize } from './tokens';
import { parser } from './grammar';
import { interpreter, Opts } from './interpreter';
import { ILexingResult, IRecognitionException } from 'chevrotain';
import { AngleMode } from './angle-mode';

export { AngleMode }

const { DEGREES, RADIANS } = AngleMode;

export const calculate = (
  text: string,
  opts: { angleMode: AngleMode } = { angleMode: RADIANS }) => {
  const lexResult = tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.expression();
  // const value = opts.angleMode === DEGREES ? degrees.visit(cst) : radians.visit(cst);
  const value = interpreter.visit(cst, new Opts(opts.angleMode));
  return { value, lexResult, parseErrors: parser.errors }
}