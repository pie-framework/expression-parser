"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_grammar_1 = require("./expression-grammar");
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
const math_utils_1 = require("./math-utils");
const char_utils_1 = require("./char-utils");
exports.BaseCstVisitor = expression_grammar_1.parser.getBaseCstVisitorConstructor();
class CalculatorInterpreter extends exports.BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }
    expression(ctx) {
        return this.visit(ctx.additionExpression);
    }
    additionExpression(ctx) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                let rhsValue = this.visit(rhsOperand);
                let operator = ctx.AdditionOperator[idx];
                if (chevrotain_1.tokenMatcher(operator, tokens_1.Plus)) {
                    result = parseFloat((result + rhsValue).toFixed(10));
                }
                else {
                    result -= rhsValue;
                }
            });
        }
        return result;
    }
    multiplicationExpression(ctx) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                let rhsValue = this.visit(rhsOperand);
                let operator = ctx.MultiplicationOperator[idx];
                if (chevrotain_1.tokenMatcher(operator, tokens_1.Multi)) {
                    result *= rhsValue;
                }
                else {
                    result /= rhsValue;
                }
            });
        }
        return result;
    }
    number(ctx) {
        if (ctx.decimal) {
            return parseFloat(`${ctx.int[0].image}.${ctx.decimal[0].image}`);
        }
        else {
            return parseInt(ctx.int[0].image, 10);
        }
    }
    atomicExpression(ctx) {
        if (ctx.parenthesisExpression) {
            return this.visit(ctx.parenthesisExpression);
        }
        else if (ctx.number) {
            return this.visit(ctx.number);
        }
        else if (ctx.powerFunction) {
            return this.visit(ctx.powerFunction);
        }
        else if (ctx.percent) {
            return this.visit(ctx.percent);
        }
        else if (ctx.logFunction) {
            return this.visit(ctx.logFunction);
        }
        else if (ctx.squareRootFunction) {
            return this.visit(ctx.squareRootFunction);
        }
        else if (ctx.pi) {
            return this.visit(ctx.pi);
        }
        else if (ctx.exponentialNumber) {
            return this.visit(ctx.exponentialNumber);
        }
        else if (ctx.factorial) {
            return this.visit(ctx.factorial);
        }
    }
    factorial(ctx) {
        const base = parseInt(ctx.base[0].image, 10);
        return math_utils_1.factorialLoop(base);
    }
    pi(ctx) {
        return Math.PI;
    }
    percent(ctx) {
        const v = parseInt(ctx.NumberLiteral[0].image, 10);
        return v * 0.01;
    }
    parenthesisExpression(ctx) {
        return this.visit(ctx.expression);
    }
    logFunction(ctx) {
        console.log('LOG!!');
        const base = this.visit(ctx.base);
        return Math.log(base);
    }
    powerFunction(ctx) {
        const base = this.visit(ctx.base);
        const exponent = this.visit(ctx.exponent);
        return Math.pow(base, exponent);
    }
    exponent(ctx) {
        if (!ctx.SuperScriptNumber) {
            return 2;
        }
        else {
            const normal = ctx.SuperScriptNumber
                .map(s => s.image)
                .map(char_utils_1.superToNormal)
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
        const base = this.visit(ctx.base);
        return Math.pow(base, 1 / exponent);
    }
}
exports.CalculatorInterpreter = CalculatorInterpreter;
exports.interpreter = new CalculatorInterpreter();
//# sourceMappingURL=interpreter.js.map