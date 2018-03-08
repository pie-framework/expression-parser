import { tokenMatcher, Lexer, Parser, Rule } from 'chevrotain';

import {
  allTokens,
  AdditionOperator,
  MultiplicationOperator,
  NumberLiteral,
  Percent,
  Factorial,
  DecimalPlace,
  Pi,
  LParen,
  RParen,
  SuperScriptNumber,
  SquareRoot,
  LogFunc,
  PowerFunc,
  Comma,
  Plus,
  Multi,
  AngleFunction,
  LnFunc,
  Euler,
  Abs,
  Minus,
  Digit
} from './tokens';
import { factorialLoop } from './math-utils';
import { superToNormal } from './char-utils';


export class CalculatorPure extends Parser {
  public expression;
  public exponent;
  public parenthesisExpression;
  public powerFunction;
  public logFunction;
  public squareRootFunction;
  public pi;
  public atomicExpression;
  public exponentialNumber;
  public number;
  public dotFloat;
  public int;
  public float;
  public factorial;
  public additionExpression;
  public multiplicationExpression;
  public percent;
  public angleFunction;
  public lnFunction;
  public euler;
  public abs;

  constructor(input) {
    super(input, allTokens, { outputCst: true, maxLookahead: 5 })

    this.expression = this.RULE("expression", () => {
      this.SUBRULE(this.additionExpression)
    })

    this.additionExpression = this.RULE("additionExpression", () => {
      this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" })
      this.MANY(() => {
        this.CONSUME(AdditionOperator)
        this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" })
      })
    })

    this.multiplicationExpression = this.RULE("multiplicationExpression", () => {
      this.SUBRULE(this.atomicExpression, { LABEL: "lhs" })
      this.MANY(() => {
        this.CONSUME(MultiplicationOperator)
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        this.SUBRULE2(this.atomicExpression, { LABEL: "rhs" })
      })
    })

    this.percent = this.RULE('percent', () => {
      this.SUBRULE(this.number, { LABEL: 'base' });
      this.CONSUME(Percent)
    });

    this.factorial = this.RULE('factorial', () => {
      this.SUBRULE(this.int, { LABEL: 'base' });
      this.CONSUME(Factorial);
    });

    this.number = this.RULE('number', () => {

      this.OR([
        { ALT: () => this.SUBRULE(this.float) },
        { ALT: () => this.SUBRULE(this.int) },
        { ALT: () => this.SUBRULE(this.dotFloat) },
      ]);
    });

    this.dotFloat = this.RULE('dotFloat', () => {
      this.OPTION(() => {
        this.CONSUME(Minus, { LABEL: 'minus' });
      });
      this.CONSUME2(DecimalPlace);
      this.AT_LEAST_ONE(() => {
        this.CONSUME(Digit, { LABEL: 'decimals' });
      });
    });

    this.int = this.RULE('int', () => {
      this.OPTION(() => {
        this.CONSUME(Minus, { LABEL: 'minus' });
      });
      this.CONSUME(Digit, { LABEL: 'digits' });
      this.OPTION2(() => {
        this.CONSUME(DecimalPlace, { LABEL: 'unused_decimal' })
      });
    });

    this.float = this.RULE('float', () => {
      this.OPTION(() => {
        this.CONSUME(Minus, { LABEL: 'minus' });
      });
      this.CONSUME2(Digit, { LABEL: 'int' });
      this.CONSUME3(DecimalPlace);
      this.AT_LEAST_ONE(() => {
        this.CONSUME(Digit, { LABEL: 'decimals' })
      });
    });

    this.exponentialNumber = this.RULE('exponentialNumber', () => {
      this.SUBRULE(this.number, { LABEL: 'base' });
      this.SUBRULE2(this.exponent, { LABEL: 'exponent' });
    });

    this.atomicExpression = this.RULE("atomicExpression", () => {
      this.OR([
        /** 
        * parenthesisExpression has the highest precedence and thus it appears
        * in the "lowest" leaf in the expression ParseTree.
        */
        { ALT: () => this.SUBRULE(this.parenthesisExpression) },
        { ALT: () => this.SUBRULE(this.percent) },
        { ALT: () => this.SUBRULE(this.powerFunction) },
        { ALT: () => this.SUBRULE(this.lnFunction) },
        { ALT: () => this.SUBRULE(this.logFunction) },
        { ALT: () => this.SUBRULE(this.angleFunction) },
        { ALT: () => this.SUBRULE(this.squareRootFunction) },
        { ALT: () => this.SUBRULE(this.abs) },
        { ALT: () => this.SUBRULE(this.pi) },
        { ALT: () => this.SUBRULE(this.euler) },
        { ALT: () => this.SUBRULE(this.factorial) },
        { ALT: () => this.SUBRULE(this.exponentialNumber) },
        { ALT: () => this.SUBRULE(this.number) },
      ])
    })

    this.pi = this.RULE('pi', () => {
      this.CONSUME(Pi);
    });

    this.euler = this.RULE('euler', () => {
      this.CONSUME(Euler);
    });

    this.parenthesisExpression = this.RULE('parenthesisExpression', () => {
      this.CONSUME(LParen)
      this.SUBRULE(this.expression)
      this.CONSUME(RParen)
    });

    this.exponent = this.RULE('exponent', () => {
      this.AT_LEAST_ONE(() => {
        this.CONSUME(SuperScriptNumber);
      });
    });

    this.squareRootFunction = this.RULE('squareRootFunction', () => {
      this.OPTION1(() => {
        this.SUBRULE(this.exponent, { LABEL: 'exponent' })
      });
      this.CONSUME(SquareRoot);
      this.CONSUME(LParen);
      this.SUBRULE(this.expression, { LABEL: 'base' });
      this.CONSUME(RParen);
    });

    this.angleFunction = this.RULE('angleFunction', () => {
      this.CONSUME(AngleFunction);
      this.CONSUME(LParen);
      this.SUBRULE(this.expression, { LABEL: 'base' });
      this.CONSUME(RParen);
    });

    this.lnFunction = this.RULE("lnFunction", () => {
      this.CONSUME(LnFunc)
      this.CONSUME(LParen)
      this.SUBRULE(this.expression, { LABEL: "base" })
      this.CONSUME(RParen)
    });

    this.logFunction = this.RULE("logFunction", () => {
      this.CONSUME(LogFunc)
      this.CONSUME(LParen)
      this.SUBRULE(this.expression, { LABEL: "base" })
      this.CONSUME(RParen)
    });

    this.powerFunction = this.RULE("powerFunction", () => {
      this.CONSUME(PowerFunc)
      this.CONSUME(LParen)
      this.SUBRULE(this.expression, { LABEL: "base" })
      this.CONSUME(Comma)
      this.SUBRULE2(this.expression, { LABEL: "exponent" })
      this.CONSUME(RParen)
    });

    this.abs = this.RULE('abs', () => {
      this.CONSUME(Abs);
      this.CONSUME(LParen);
      this.SUBRULE(this.expression, { LABEL: "base" });
      this.CONSUME(RParen);
    });

    /**
     *  very important to call this after all the rules have been defined.
     * otherwise the parser may not work correctly as it will lack information
     * derived during the self analysis phase
     */
    Parser.performSelfAnalysis(this)
  }
}

export const parser = new CalculatorPure([])
