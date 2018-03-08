"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_grammar_1 = require("./simple-grammar");
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
const debug_1 = require("debug");
const log = debug_1.default('expression-parser:interpreter');
exports.BaseCstVisitor = simple_grammar_1.parser.getBaseCstVisitorConstructor();
class SimpleInterpreter extends exports.BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }
    expression(ctx) {
        return this.visit(ctx.number);
    }
    addSubtract(ctx) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                const rhsValue = this.visit(rhsOperand);
                const operator = ctx.AdditionOperator[idx];
                if (chevrotain_1.tokenMatcher(operator, tokens_1.Plus)) {
                    result = parseFloat((result + rhsValue).toFixed(10));
                }
                else {
                    result = parseFloat((result - rhsValue).toFixed(10));
                }
            });
        }
        return result;
    }
    multiplyDivide(ctx) {
        console.log('multiplyDivide: ctx:', ctx);
        let result = this.visit(ctx.lhs);
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                const rhsValue = this.visit(rhsOperand);
                const operator = ctx.MultiplicationOperator[idx];
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
    atomic(ctx) {
        console.log('atomic - ctx: ', ctx);
        if (ctx.number) {
            return this.visit(ctx.number);
        }
        return 0;
    }
    number(ctx) {
        console.log(ctx);
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
}
exports.SimpleInterpreter = SimpleInterpreter;
exports.interpreter = new SimpleInterpreter();
//# sourceMappingURL=simple-interpreter.js.map