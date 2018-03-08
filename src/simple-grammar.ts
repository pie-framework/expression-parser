import { tokenMatcher, Lexer, Parser, Rule, IToken } from 'chevrotain';

import {
  allTokens,
  NumberLiteral,
  DecimalPlace,
  Minus,
  Digit,
  AdditionOperator,
  MultiplicationOperator,
  LParen,
  RParen,
  Multi,
  Div
} from './tokens';
import { TokenType } from './simple-tokens';
import debug from 'debug';

const log = debug('expression-parser:simple-grammar');


// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
export class SimpleGrammar extends Parser {
  public expression;
  public number;
  public float;
  public int;
  public dotFloat;
  public addSubtract;
  // public multiplyDivide;
  public multiply;
  public divide;
  public atomic;
  public parenthesis;
  public implicitMultiply;

  constructor(input) {
    super(input, allTokens, { outputCst: true })

    this.expression = this.RULE('expression', () => {
      this.SUBRULE(this.implicitMultiply);
    });

    this.addSubtract = this.RULE('addSubtract', () => {
      // using labels can make the CST processing easier
      this.SUBRULE(this.multiply, { LABEL: 'lhs' })
      this.MANY(() => {
        this.CONSUME(AdditionOperator)
        this.SUBRULE2(this.multiply, { LABEL: 'rhs' })
      });
    });

    this.multiply = this.RULE('multiply', () => {
      this.SUBRULE(this.divide, { LABEL: 'lhs' });
      this.OPTION(() => {
        this.CONSUME(Multi);
        this.SUBRULE2(this.divide, { LABEL: 'rhs' });
      });
    });

    this.divide = this.RULE('divide', () => {
      this.SUBRULE(this.atomic, { LABEL: 'lhs' });
      this.OPTION(() => {
        this.CONSUME(Div);
        this.SUBRULE2(this.atomic, { LABEL: 'rhs' });
      });
    });

    this.implicitMultiply = this.RULE('implicitMultiply', () => {
      this.SUBRULE(this.addSubtract, { LABEL: 'lhs' });
      this.OPTION(() => {
        this.OPTION2(() => {
          this.CONSUME(Multi);
        });
        this.SUBRULE2(this.addSubtract, { LABEL: 'rhs' });
      });
    });
    // this.multiplyDivide = this.RULE('multiplyDivide', () => {
    //   this.SUBRULE(this.atomic, { LABEL: 'lhs' });
    //   this.MANY(() => {
    //     this.CONSUME(MultiplicationOperator)
    //     //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
    //     this.SUBRULE2(this.atomic, { LABEL: 'rhs' });
    //   })
    // });

    // this.implicitMultiply = this.RULE('implicitMultiply', () => {
    //   this.SUBRULE(this.addSubtract, { LABEL: 'lhs' });
    //   this.OPTION(() => {
    //     this.SUBRULE2(this.addSubtract, { LABEL: 'rhs' })
    //   });
    // });

    this.parenthesis = this.RULE('parenthesis', () => {
      this.CONSUME(LParen);
      this.SUBRULE(this.expression);
      this.CONSUME(RParen);
    });

    this.atomic = this.RULE('atomic', () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.parenthesis) },
        { ALT: () => this.SUBRULE(this.number) }
      ])
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

    Parser.performSelfAnalysis(this)
  }

  consumeInternal(tokenType: TokenType, idx: number, opts) {
    log('[consumeInternal]: ', tokenType, idx, opts);
    return super.consumeInternal(tokenType, idx, opts);
  }
}

// wrapping it all together
// reuse the same parser instance.
export const parser = new SimpleGrammar([])
