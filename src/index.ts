import { parser, CalculatorLexer } from './expression-grammar';
import { interpreter } from './interpreter';
import { ILexingResult, IRecognitionException } from 'chevrotain';

export const calculate = (text: string) => {
  const lexResult = CalculatorLexer.tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.expression();
  const value = interpreter.visit(cst);
  return { value, lexResult, parseErrors: parser.errors }
}