import { createToken, TokenType, Lexer, ILexingResult } from 'chevrotain';
export { TokenType }

/**
 *  ---------------- lexer -----------------
 * using the NA pattern marks this Token class as 'irrelevant' for the Lexer.
 * AdditionOperator defines a Tokens hierarchy but only the leafs in this hierarchy define
 * actual Tokens that can appear in the text
 */
export const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA
});

export const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  categories: AdditionOperator
});

export const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  categories: AdditionOperator
});


export const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA
});

export const Multi = createToken({
  name: 'Multi',
  pattern: /[\*|\×]/,
  categories: MultiplicationOperator
});

export const Div = createToken({
  name: 'Div',
  pattern: /[\/|\÷]/,
  categories: MultiplicationOperator
});

export const AngleFunction = createToken({
  name: 'AngleFunction',
  pattern: Lexer.NA
});

const createAngleFn = (n: string) => {
  return createToken({
    name: `${n.substring(0, 1).toUpperCase()}${n.substring(1)}`,
    pattern: new RegExp(n),
    categories: AngleFunction
  });
}

export const ASin = createAngleFn('asin');
export const ACos = createAngleFn('acos');
export const ATan = createAngleFn('atan');
export const Sin = createAngleFn('sin');
export const Cos = createAngleFn('cos');
export const Tan = createAngleFn('tan');

export const Factorial = createToken({
  name: 'Factorial',
  pattern: /!/
});

export const Pi = createToken({
  name: 'Pi',
  pattern: /π/
});

export const SuperScriptNumber = createToken({
  name: 'SuperScriptNumber',
  pattern: /[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]/
});

export const SquareRoot = createToken({
  name: 'SquareRoot',
  pattern: /√/
});

export const Percent = createToken({
  name: 'Percent',
  pattern: /%/
});


export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });

export const Digit = createToken({
  name: 'Digit',
  pattern: /[0-9]+/
});

export const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /[1-9]\*/
});

export const DecimalPlace = createToken({
  name: 'DecimalPlace',
  pattern: /\./
});

export const PowerFunc = createToken({ name: 'PowerFunc', pattern: /power/ })
export const LogFunc = createToken({ name: 'LogFunc', pattern: /log/ })
export const LnFunc = createToken({ name: 'LnFunc', pattern: /ln/ })
export const Comma = createToken({ name: 'Comma', pattern: /,/ })

export const Euler = createToken({ name: 'Euler', pattern: /e/ });

export const Abs = createToken({ name: 'Abs', pattern: /abs/ });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
  line_breaks: true
});

export const allTokens: TokenType[] = [
  WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
  Plus,
  Minus,
  Multi,
  Div,
  Percent,
  LParen,
  RParen,
  NumberLiteral,
  Digit,
  AdditionOperator,
  MultiplicationOperator,
  PowerFunc,
  LogFunc,
  LnFunc,
  Comma,
  SquareRoot,
  SuperScriptNumber,
  Pi,
  DecimalPlace,
  Factorial,
  AngleFunction,
  ASin,
  ACos,
  ATan,
  Sin,
  Cos,
  Tan,
  Euler,
  Abs
];

export const CalculatorLexer = new Lexer(allTokens);

export const tokenize = (s: string) => CalculatorLexer.tokenize(s);
