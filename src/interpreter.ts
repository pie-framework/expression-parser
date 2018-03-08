import { parser } from './grammar';
import { tokenMatcher, ICstVisitor, IToken } from 'chevrotain';
import { Plus, Multi, Sin, Cos, Tan, ASin, ACos, ATan } from './tokens';
import { factorialLoop, sin, cos, tan, acos, asin, atan, AngleFunction } from './math-utils';
import { superToNormal } from './char-utils';
import { AngleMode } from './angle-mode';
import debug from 'debug';

const log = debug('expression-parser:interpreter');

// ----------------- Interpreter -----------------
// Obtains the default CstVisitor constructor to extend.
export const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

export class Opts {
  constructor(readonly angleMode: AngleMode) { }
}

const findAngleFunction = (token: IToken): ((n: number, m: AngleMode) => number) => {

  log('[findAngleFunction] token: ', token);
  if (tokenMatcher(token, Sin)) {
    log('return > sin')
    return sin;
  } else if (tokenMatcher(token, Cos)) {
    return cos;
  } else if (tokenMatcher(token, Tan)) {
    return tan;
  } else if (tokenMatcher(token, ASin)) {
    return asin;
  } else if (tokenMatcher(token, ACos)) {
    return acos;
  } else if (tokenMatcher(token, ATan)) {
    return atan;
  }
}
// All our semantics go into the visitor, completly separated from the grammar.
export class CalculatorInterpreter extends BaseCstVisitor {
  constructor() {
    super()
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor()
  }

  expression(ctx, opts: Opts) {
    // visiting an array is equivalent to visiting its first element.
    return this.visit(ctx.additionExpression, opts);
  }

  // Note the usage if the "rhs" and "lhs" labels to increase the readability.
  additionExpression(ctx, opts: Opts) {
    let result = this.visit(ctx.lhs, opts);

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand, opts)
        let operator = ctx.AdditionOperator[idx]

        if (tokenMatcher(operator, Plus)) {
          result = parseFloat((result + rhsValue).toFixed(10));
        } else {
          // Minus
          result -= rhsValue
        }
      })
    }
    return result
  }


  multiplicationExpression(ctx, opts: Opts) {
    let result = this.visit(ctx.lhs, opts)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand, opts)
        let operator = ctx.MultiplicationOperator[idx]

        if (tokenMatcher(operator, Multi)) {
          result *= rhsValue
        } else {
          // Division
          result /= rhsValue
        }
      })
    }

    return result
  }

  number(ctx) {
    log('[number] ctx: ', ctx);

    if (ctx.int) {
      return this.visit(ctx.int);
    } else if (ctx.float) {
      return this.visit(ctx.float);
    } else if (ctx.dotFloat) {
      return this.visit(ctx.dotFloat);
    }
  }

  dotFloat(ctx) {
    const multiplier = ctx.minus ? -1 : 1;
    const decimals = ctx.decimals[0].image;
    const f = parseFloat(`0.${decimals}`);
    return f * multiplier;
  }

  float(ctx) {
    const multiplier = ctx.minus ? -1 : 1;
    const int = ctx.int[0].image;
    const decimals = ctx.decimals[0].image;
    if (decimals === '0') {
      return parseInt(int, 10);
    } else {
      const f = parseFloat(`${int}.${decimals}`);
      return f * multiplier;
    }
  }

  int(ctx) {
    const multiplier = ctx.minus ? -1 : 1;
    const i = parseInt(ctx.digits[0].image, 10);
    return multiplier * i;
  }

  atomicExpression(ctx, opts: Opts) {
    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression, opts)
    } else if (ctx.number) {
      return this.visit(ctx.number, opts);
    } else if (ctx.powerFunction) {
      return this.visit(ctx.powerFunction, opts)
    } else if (ctx.percent) {
      return this.visit(ctx.percent, opts);
    } else if (ctx.logFunction) {
      return this.visit(ctx.logFunction, opts);
    } else if (ctx.lnFunction) {
      return this.visit(ctx.lnFunction, opts);
    } else if (ctx.angleFunction) {
      return this.visit(ctx.angleFunction, opts);
    } else if (ctx.squareRootFunction) {
      return this.visit(ctx.squareRootFunction, opts)
    } else if (ctx.pi) {
      return this.visit(ctx.pi, opts);
    } else if (ctx.euler) {
      return this.visit(ctx.euler, opts);
    } else if (ctx.exponentialNumber) {
      return this.visit(ctx.exponentialNumber, opts);
    } else if (ctx.factorial) {
      return this.visit(ctx.factorial, opts);
    } else if (ctx.abs) {
      return this.visit(ctx.abs);
    }
  }

  factorial(ctx, opts: Opts) {
    const base = this.visit(ctx.base);
    return factorialLoop(base);
  }

  pi(ctx, opts: Opts) {
    return Math.PI;
  }

  euler(ctx, opts: Opts) {
    return Math.E;
  }

  percent(ctx, opts: Opts) {
    log('[percent] ctx: ', ctx);
    const r = this.visit(ctx.base);
    return r * 0.01;
  }

  parenthesisExpression(ctx, opts: Opts) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.expression, opts);
  }

  angleFunction(ctx, opts: Opts) {

    const fn: AngleFunction = findAngleFunction(ctx.AngleFunction[0]);

    log('[angleFunction] fn: ', fn);

    const base = this.visit(ctx.base, opts);

    log('[angleFunction] base: ', base);

    if (!fn) {
      throw new Error(`cant find angle functino for ${ctx.AngleFunction[0]}`);
    }

    return fn(base, opts.angleMode);
  }

  logFunction(ctx, opts: Opts) {
    const base = this.visit(ctx.base, opts);
    return Math.log10(base);
  }

  lnFunction(ctx, opts: Opts) {
    const base = this.visit(ctx.base, opts);
    return Math.log(base);
  }

  abs(ctx, opts: Opts) {
    log('[abs] ctx: ', ctx);
    const base = this.visit(ctx.base, opts);
    return Math.abs(base);
  }

  powerFunction(ctx, opts: Opts) {
    const base = this.visit(ctx.base, opts)
    const exponent = this.visit(ctx.exponent, opts)
    return Math.pow(base, exponent)
  }

  exponent(ctx, opts: Opts) {
    if (!ctx.SuperScriptNumber) {
      return 2;
    } else {
      const normal = ctx.SuperScriptNumber
        .map(s => s.image)
        .map(superToNormal)
        .join('');
      const out = parseInt(normal, 10);
      return out;
    }
  }

  exponentialNumber(ctx, opts: Opts) {
    const exponent = this.visit(ctx.exponent, opts);
    const base = this.visit(ctx.base, opts);
    return Math.pow(base, exponent);
  }

  squareRootFunction(ctx, opts: Opts) {
    const exponent = ctx.exponent ? this.visit(ctx.exponent, opts) : 2;
    const base = this.visit(ctx.base, opts);
    return Math.pow(base, 1 / exponent);
  }
}

export const interpreter = new CalculatorInterpreter();
