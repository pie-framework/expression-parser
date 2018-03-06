import { parser, CalculatorLexer } from './expression-grammar';
import { tokenMatcher, ICstVisitor } from 'chevrotain';
import { Plus, Multi } from './tokens';
import { factorialLoop } from './math-utils';
import { superToNormal } from './char-utils';

// ----------------- Interpreter -----------------
// Obtains the default CstVisitor constructor to extend.
export const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

// All our semantics go into the visitor, completly separated from the grammar.
export class CalculatorInterpreter extends BaseCstVisitor {
  constructor() {
    super()
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor()
  }

  expression(ctx) {
    // visiting an array is equivalent to visiting its first element.
    return this.visit(ctx.additionExpression)
  }

  // Note the usage if the "rhs" and "lhs" labels to increase the readability.
  additionExpression(ctx) {
    let result = this.visit(ctx.lhs)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand)
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


  multiplicationExpression(ctx) {
    let result = this.visit(ctx.lhs)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand)
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
    if (ctx.decimal) {
      return parseFloat(`${ctx.int[0].image}.${ctx.decimal[0].image}`);
    } else {
      return parseInt(ctx.int[0].image, 10);
    }
  }

  atomicExpression(ctx) {
    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression)
    } else if (ctx.number) {
      return this.visit(ctx.number);
    } else if (ctx.powerFunction) {
      return this.visit(ctx.powerFunction)
    } else if (ctx.percent) {
      return this.visit(ctx.percent);
    } else if (ctx.logFunction) {
      return this.visit(ctx.logFunction);
    } else if (ctx.squareRootFunction) {
      return this.visit(ctx.squareRootFunction)
    } else if (ctx.pi) {
      return this.visit(ctx.pi);
    } else if (ctx.exponentialNumber) {
      return this.visit(ctx.exponentialNumber);
    } else if (ctx.factorial) {
      return this.visit(ctx.factorial);
    }
  }

  factorial(ctx) {
    const base = parseInt(ctx.base[0].image, 10);
    return factorialLoop(base);
  }

  pi(ctx) {
    return Math.PI;
  }

  percent(ctx) {
    const v = parseInt(ctx.NumberLiteral[0].image, 10);
    return v * 0.01;
  }

  parenthesisExpression(ctx) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.expression)
  }

  logFunction(ctx) {
    console.log('LOG!!');
    const base = this.visit(ctx.base);
    return Math.log(base);
  }

  powerFunction(ctx) {
    const base = this.visit(ctx.base)
    const exponent = this.visit(ctx.exponent)
    return Math.pow(base, exponent)
  }

  exponent(ctx) {
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

  exponentialNumber(ctx) {
    const exponent = this.visit(ctx.exponent);
    const base = this.visit(ctx.base);
    return Math.pow(base, exponent);
  }

  squareRootFunction(ctx) {
    const exponent = ctx.exponent ? this.visit(ctx.exponent) : 2;
    const base = this.visit(ctx.base)
    return Math.pow(base, 1 / exponent);
  }
}

// We only need a single interpreter instance because our interpreter has no state.
export const interpreter = new CalculatorInterpreter()
