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
  Euler
} from './tokens';
import { factorialLoop } from './math-utils';
import { superToNormal } from './char-utils';


// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
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
  public factorial;
  public additionExpression;
  public multiplicationExpression;
  public percent;
  public angleFunction;
  public lnFunction;
  public euler;

  constructor(input) {
    super(input, allTokens, { outputCst: true })

    this.expression = this.RULE("expression", () => {
      this.SUBRULE(this.additionExpression)
    })

    // Lowest precedence thus it is first in the rule chain
    // The precedence of binary expressions is determined by how far down the Parse Tree
    // The binary expression appears.
    this.additionExpression = this.RULE("additionExpression", () => {
      // using labels can make the CST processing easier
      this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" })
      this.MANY(() => {
        // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
        this.CONSUME(AdditionOperator)
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
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

    //TODO: ....
    // this.RULE('implicitMultiplication', () => {
    //   this.SUBRULE(this.atomicExpression, { LABEL: 'lhs' });
    //   this.MANY(() => {
    //     this.CONSUME(WhiteSpace);
    //     this.SUBRULE2(this.atomicExpression, { LABEL: 'rhs' });
    //   });
    // });

    this.percent = this.RULE('percent', () => {
      this.CONSUME(NumberLiteral)
      this.CONSUME(Percent)
    });

    this.factorial = this.RULE('factorial', () => {
      this.CONSUME(NumberLiteral, { LABEL: 'base' });
      this.AT_LEAST_ONE(() => {
        this.CONSUME(Factorial);
      });
    });

    this.number = this.RULE('number', () => {

      this.AT_LEAST_ONE(() => {
        this.CONSUME(NumberLiteral, { LABEL: 'int' })
      });

      this.OPTION(() => {
        this.CONSUME(DecimalPlace);
        this.AT_LEAST_ONE2(() => {
          this.CONSUME2(NumberLiteral, { LABEL: 'decimal' });
        })
      });
    });

    this.exponentialNumber = this.RULE('exponentialNumber', () => {
      this.SUBRULE(this.number, { LABEL: 'base' });
      this.SUBRULE2(this.exponent, { LABEL: 'exponent' });
    });

    this.atomicExpression = this.RULE("atomicExpression", () => {
      this.OR([
        // parenthesisExpression has the highest precedence and thus it appears
        // in the "lowest" leaf in the expression ParseTree.
        { ALT: () => this.SUBRULE(this.parenthesisExpression) },
        { ALT: () => this.SUBRULE(this.percent) },
        { ALT: () => this.SUBRULE(this.powerFunction) },
        { ALT: () => this.SUBRULE(this.lnFunction) },
        { ALT: () => this.SUBRULE(this.logFunction) },
        { ALT: () => this.SUBRULE(this.angleFunction) },
        { ALT: () => this.SUBRULE(this.squareRootFunction) },
        { ALT: () => this.SUBRULE(this.pi) },
        { ALT: () => this.SUBRULE(this.euler) },
        { ALT: () => this.SUBRULE(this.exponentialNumber) },
        { ALT: () => this.SUBRULE(this.factorial) },
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
    })

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    Parser.performSelfAnalysis(this)
  }
}

// wrapping it all together
// reuse the same parser instance.
export const parser = new CalculatorPure([])
