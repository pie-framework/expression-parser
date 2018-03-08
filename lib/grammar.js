"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
class CalculatorPure extends chevrotain_1.Parser {
    constructor(input) {
        super(input, tokens_1.allTokens, { outputCst: true, maxLookahead: 5 });
        this.expression = this.RULE("expression", () => {
            this.SUBRULE(this.additionExpression);
        });
        this.additionExpression = this.RULE("additionExpression", () => {
            this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
            this.MANY(() => {
                this.CONSUME(tokens_1.AdditionOperator);
                this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" });
            });
        });
        this.multiplicationExpression = this.RULE("multiplicationExpression", () => {
            this.SUBRULE(this.atomicExpression, { LABEL: "lhs" });
            this.MANY(() => {
                this.CONSUME(tokens_1.MultiplicationOperator);
                this.SUBRULE2(this.atomicExpression, { LABEL: "rhs" });
            });
        });
        this.percent = this.RULE('percent', () => {
            this.SUBRULE(this.number, { LABEL: 'base' });
            this.CONSUME(tokens_1.Percent);
        });
        this.factorial = this.RULE('factorial', () => {
            this.SUBRULE(this.int, { LABEL: 'base' });
            this.CONSUME(tokens_1.Factorial);
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
                this.CONSUME(tokens_1.Minus, { LABEL: 'minus' });
            });
            this.CONSUME2(tokens_1.DecimalPlace);
            this.AT_LEAST_ONE(() => {
                this.CONSUME(tokens_1.Digit, { LABEL: 'decimals' });
            });
        });
        this.int = this.RULE('int', () => {
            this.OPTION(() => {
                this.CONSUME(tokens_1.Minus, { LABEL: 'minus' });
            });
            this.CONSUME(tokens_1.Digit, { LABEL: 'digits' });
            this.OPTION2(() => {
                this.CONSUME(tokens_1.DecimalPlace, { LABEL: 'unused_decimal' });
            });
        });
        this.float = this.RULE('float', () => {
            this.OPTION(() => {
                this.CONSUME(tokens_1.Minus, { LABEL: 'minus' });
            });
            this.CONSUME2(tokens_1.Digit, { LABEL: 'int' });
            this.CONSUME3(tokens_1.DecimalPlace);
            this.AT_LEAST_ONE(() => {
                this.CONSUME(tokens_1.Digit, { LABEL: 'decimals' });
            });
        });
        this.exponentialNumber = this.RULE('exponentialNumber', () => {
            this.SUBRULE(this.number, { LABEL: 'base' });
            this.SUBRULE2(this.exponent, { LABEL: 'exponent' });
        });
        this.atomicExpression = this.RULE("atomicExpression", () => {
            this.OR([
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
            ]);
        });
        this.pi = this.RULE('pi', () => {
            this.CONSUME(tokens_1.Pi);
        });
        this.euler = this.RULE('euler', () => {
            this.CONSUME(tokens_1.Euler);
        });
        this.parenthesisExpression = this.RULE('parenthesisExpression', () => {
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression);
            this.CONSUME(tokens_1.RParen);
        });
        this.exponent = this.RULE('exponent', () => {
            this.AT_LEAST_ONE(() => {
                this.CONSUME(tokens_1.SuperScriptNumber);
            });
        });
        this.squareRootFunction = this.RULE('squareRootFunction', () => {
            this.OPTION1(() => {
                this.SUBRULE(this.exponent, { LABEL: 'exponent' });
            });
            this.CONSUME(tokens_1.SquareRoot);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: 'base' });
            this.CONSUME(tokens_1.RParen);
        });
        this.angleFunction = this.RULE('angleFunction', () => {
            this.CONSUME(tokens_1.AngleFunction);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: 'base' });
            this.CONSUME(tokens_1.RParen);
        });
        this.lnFunction = this.RULE("lnFunction", () => {
            this.CONSUME(tokens_1.LnFunc);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: "base" });
            this.CONSUME(tokens_1.RParen);
        });
        this.logFunction = this.RULE("logFunction", () => {
            this.CONSUME(tokens_1.LogFunc);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: "base" });
            this.CONSUME(tokens_1.RParen);
        });
        this.powerFunction = this.RULE("powerFunction", () => {
            this.CONSUME(tokens_1.PowerFunc);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: "base" });
            this.CONSUME(tokens_1.Comma);
            this.SUBRULE2(this.expression, { LABEL: "exponent" });
            this.CONSUME(tokens_1.RParen);
        });
        this.abs = this.RULE('abs', () => {
            this.CONSUME(tokens_1.Abs);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: "base" });
            this.CONSUME(tokens_1.RParen);
        });
        chevrotain_1.Parser.performSelfAnalysis(this);
    }
}
exports.CalculatorPure = CalculatorPure;
exports.parser = new CalculatorPure([]);
//# sourceMappingURL=grammar.js.map