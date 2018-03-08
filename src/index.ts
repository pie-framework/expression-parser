import { tokenize } from './tokens';
import { parser } from './grammar';
import { interpreter, Opts } from './interpreter';
import { ILexingResult, IRecognitionException } from 'chevrotain';
import { AngleMode } from './angle-mode';
import debug from 'debug';

export { AngleMode }

const log = debug('expression-parser');

const { DEGREES, RADIANS } = AngleMode;

export type CalculateResult = {
  value: string,
  error?: {
    e: Error,
    start: number,
    end: number
  }

}

export const calculate = (
  text: string,
  opts: { angleMode: AngleMode } = { angleMode: RADIANS }): CalculateResult => {
  const lexResult = tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.expression();
  const value = interpreter.visit(cst, new Opts(opts.angleMode));
  const error = (parser.errors.length > 0) ? {
    //TODO: give a bit more detail here
    e: new Error('Error parsing expression'),
    start: undefined,
    end: undefined
  } : undefined;

  if (parser.errors.length > 0) {
    log('errors', parser.errors);
  }
  return { value, error }
}
