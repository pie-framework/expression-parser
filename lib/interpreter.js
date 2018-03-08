"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammar_1 = require("./grammar");
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
const math_utils_1 = require("./math-utils");
const char_utils_1 = require("./char-utils");
const debug_1 = require("debug");
const log = debug_1.default('expression-parser:interpreter');
exports.BaseCstVisitor = grammar_1.parser.getBaseCstVisitorConstructor();
class Opts {
    constructor(angleMode) {
        this.angleMode = angleMode;
    }
}
exports.Opts = Opts;
const findAngleFunction = (token) => {
    log('[findAngleFunction] token: ', token);
    if (chevrotain_1.tokenMatcher(token, tokens_1.Sin)) {
        log('return > sin');
        return math_utils_1.sin;
    }
    else if (chevrotain_1.tokenMatcher(token, tokens_1.Cos)) {
        return math_utils_1.cos;
    }
    else if (chevrotain_1.tokenMatcher(token, tokens_1.Tan)) {
        return math_utils_1.tan;
    }
    else if (chevrotain_1.tokenMatcher(token, tokens_1.ASin)) {
        return math_utils_1.asin;
    }
    else if (chevrotain_1.tokenMatcher(token, tokens_1.ACos)) {
        return math_utils_1.acos;
    }
    else if (chevrotain_1.tokenMatcher(token, tokens_1.ATan)) {
        return math_utils_1.atan;
    }
};
class CalculatorInterpreter extends exports.BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }
    expression(ctx, opts) {
        return this.visit(ctx.additionExpression, opts);
    }
    additionExpression(ctx, opts) {
        let result = this.visit(ctx.lhs, opts);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                let rhsValue = this.visit(rhsOperand, opts);
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
    multiplicationExpression(ctx, opts) {
        let result = this.visit(ctx.lhs, opts);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                let rhsValue = this.visit(rhsOperand, opts);
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
        log('[number] ctx: ', ctx);
        if (ctx.int) {
            return this.visit(ctx.int);
        }
        else if (ctx.float) {
            return this.visit(ctx.float);
        }
        else if (ctx.dotFloat) {
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
        }
        else {
            const f = parseFloat(`${int}.${decimals}`);
            return f * multiplier;
        }
    }
    int(ctx) {
        const multiplier = ctx.minus ? -1 : 1;
        const i = parseInt(ctx.digits[0].image, 10);
        return multiplier * i;
    }
    atomicExpression(ctx, opts) {
        if (ctx.parenthesisExpression) {
            return this.visit(ctx.parenthesisExpression, opts);
        }
        else if (ctx.number) {
            return this.visit(ctx.number, opts);
        }
        else if (ctx.powerFunction) {
            return this.visit(ctx.powerFunction, opts);
        }
        else if (ctx.percent) {
            return this.visit(ctx.percent, opts);
        }
        else if (ctx.logFunction) {
            return this.visit(ctx.logFunction, opts);
        }
        else if (ctx.lnFunction) {
            return this.visit(ctx.lnFunction, opts);
        }
        else if (ctx.angleFunction) {
            return this.visit(ctx.angleFunction, opts);
        }
        else if (ctx.squareRootFunction) {
            return this.visit(ctx.squareRootFunction, opts);
        }
        else if (ctx.pi) {
            return this.visit(ctx.pi, opts);
        }
        else if (ctx.euler) {
            return this.visit(ctx.euler, opts);
        }
        else if (ctx.exponentialNumber) {
            return this.visit(ctx.exponentialNumber, opts);
        }
        else if (ctx.factorial) {
            return this.visit(ctx.factorial, opts);
        }
        else if (ctx.abs) {
            return this.visit(ctx.abs);
        }
    }
    factorial(ctx, opts) {
        const base = this.visit(ctx.base);
        return math_utils_1.factorialLoop(base);
    }
    pi(ctx, opts) {
        return Math.PI;
    }
    euler(ctx, opts) {
        return Math.E;
    }
    percent(ctx, opts) {
        log('[percent] ctx: ', ctx);
        const r = this.visit(ctx.base);
        return r * 0.01;
    }
    parenthesisExpression(ctx, opts) {
        return this.visit(ctx.expression, opts);
    }
    angleFunction(ctx, opts) {
        const fn = findAngleFunction(ctx.AngleFunction[0]);
        log('[angleFunction] fn: ', fn);
        const base = this.visit(ctx.base, opts);
        log('[angleFunction] base: ', base);
        if (!fn) {
            throw new Error(`cant find angle functino for ${ctx.AngleFunction[0]}`);
        }
        return fn(base, opts.angleMode);
    }
    logFunction(ctx, opts) {
        const base = this.visit(ctx.base, opts);
        return Math.log10(base);
    }
    lnFunction(ctx, opts) {
        const base = this.visit(ctx.base, opts);
        return Math.log(base);
    }
    abs(ctx, opts) {
        log('[abs] ctx: ', ctx);
        const base = this.visit(ctx.base, opts);
        return Math.abs(base);
    }
    powerFunction(ctx, opts) {
        const base = this.visit(ctx.base, opts);
        const exponent = this.visit(ctx.exponent, opts);
        return Math.pow(base, exponent);
    }
    exponent(ctx, opts) {
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
    exponentialNumber(ctx, opts) {
        const exponent = this.visit(ctx.exponent, opts);
        const base = this.visit(ctx.base, opts);
        return Math.pow(base, exponent);
    }
    squareRootFunction(ctx, opts) {
        const exponent = ctx.exponent ? this.visit(ctx.exponent, opts) : 2;
        const base = this.visit(ctx.base, opts);
        return Math.pow(base, 1 / exponent);
    }
}
exports.CalculatorInterpreter = CalculatorInterpreter;
exports.interpreter = new CalculatorInterpreter();
//# sourceMappingURL=interpreter.js.map