import { parser } from './simple-grammar';
import { tokenMatcher, ICstVisitor, IToken } from 'chevrotain';
import { Plus, Multi, Sin, Cos, Tan, ASin, ACos, ATan } from './tokens';
import debug from 'debug';

const log = debug('expression-parser:simple-interpreter');

// ----------------- Interpreter -----------------
// Obtains the default CstVisitor constructor to extend.
export const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

// All our semantics go into the visitor, completly separated from the grammar.
export class SimpleInterpreter extends BaseCstVisitor {
  constructor() {
    super()
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor()
  }

  expression(ctx) {
    // visiting an array is equivalent to visiting its first element.
    log('[expression] ctx: ', ctx);
    return this.visit(ctx.implicitMultiply);
  }


  addSubtract(ctx) {
    log('[addSubtract] ctx: ', ctx);
    let result = this.visit(ctx.lhs);

    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.AdditionOperator[idx]

        if (tokenMatcher(operator, Plus)) {
          result = parseFloat((result + rhsValue).toFixed(10));
        } else {
          // Minus
          result = parseFloat((result - rhsValue).toFixed(10));
        }
      })
    }
    return result;
  }

  implicitMultiply(ctx) {
    log('[implicitMultiply] !! ctx: ', ctx);
    log('[implicitMultiply] lhs: ', ctx.lhs);
    let result = this.visit(ctx.lhs);
    log('[implicitMultiply] result: ', result);

    if (ctx.rhs) {
      let r = this.visit(ctx.rhs);
      return r * result;
    }
    return result;
  }

  private md(ctx, label: string, fn: (a: number, b: number) => number) {
    log('[md] ', label, ' ctx: ', ctx);
    const lhs = this.visit(ctx.lhs);
    log('[md] ', label, ' lhs: ', lhs);
    if (ctx.rhs) {
      const rhs = this.visit(ctx.rhs);
      log('[md] ', label, ' rhs: ', rhs)
      const out = fn(lhs, rhs);
      log('[md] ', label, ' out: ', out);
      return out;
    }
    return lhs;
  }

  divide(ctx) {
    log('[divide] ctx: ')
    return this.md(ctx, 'divide', (a, b) => {
      log('[divide] ', a, '/', b);
      return (a / b)
    });
  }

  multiply(ctx) {
    return this.md(ctx, 'multiply', (a, b) => a * b);
  }

  multiplyDivide(ctx) {
    log('[multiplyDivide] ctx: ', ctx);
    let result = this.visit(ctx.lhs);

    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.MultiplicationOperator[idx]

        if (tokenMatcher(operator, Multi)) {
          result *= rhsValue
        } else {
          // Division
          result /= rhsValue
        }
      })
    }
    return result;
  }


  // implicitMultiply(ctx) {
  //   log('[implicitMultiply] ctx: ', ctx);
  //   const lhs = this.visit(ctx.lhs);
  //   log('[implicitMultiply] lhs: ', lhs);
  //   if (ctx.rhs) {
  //     const rhs = this.visit(ctx.rhs);
  //     return lhs * rhs;
  //   }
  //   return lhs;

  // }

  parenthesis(ctx) {
    log('[parenthesis] ctx: ', ctx);
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.expression);
  }

  atomic(ctx) {
    log('[atomic] ctx: ', ctx);
    if (ctx.parenthesis) {
      return this.visit(ctx.parenthesis);
    } else if (ctx.number) {
      return this.visit(ctx.number);
    }
    return 0;
  }

  number(ctx) {
    console.log(ctx)
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
}


export const interpreter = new SimpleInterpreter();
