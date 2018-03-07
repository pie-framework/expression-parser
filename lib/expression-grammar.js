"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
exports.CalculatorLexer = new chevrotain_1.Lexer(tokens_1.default);
class CalculatorPure extends chevrotain_1.Parser {
    constructor(input) {
        super(input, tokens_1.default, { outputCst: true });
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
            this.CONSUME(tokens_1.NumberLiteral);
            this.CONSUME(tokens_1.Percent);
        });
        this.factorial = this.RULE('factorial', () => {
            this.CONSUME(tokens_1.NumberLiteral, { LABEL: 'base' });
            this.AT_LEAST_ONE(() => {
                this.CONSUME(tokens_1.Factorial);
            });
        });
        this.number = this.RULE('number', () => {
            this.AT_LEAST_ONE(() => {
                this.CONSUME(tokens_1.NumberLiteral, { LABEL: 'int' });
            });
            this.OPTION(() => {
                this.CONSUME(tokens_1.DecimalPlace);
                this.AT_LEAST_ONE2(() => {
                    this.CONSUME2(tokens_1.NumberLiteral, { LABEL: 'decimal' });
                });
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
                { ALT: () => this.SUBRULE(this.logFunction) },
                { ALT: () => this.SUBRULE(this.squareRootFunction) },
                { ALT: () => this.SUBRULE(this.pi) },
                { ALT: () => this.SUBRULE(this.exponentialNumber) },
                { ALT: () => this.SUBRULE(this.factorial) },
                { ALT: () => this.SUBRULE(this.number) },
            ]);
        });
        this.pi = this.RULE('pi', () => {
            this.CONSUME(tokens_1.Pi);
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
        this.RULE("logFunction", () => {
            this.CONSUME(tokens_1.LogFunc);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: "base" });
            this.CONSUME(tokens_1.RParen);
        });
        this.RULE("powerFunction", () => {
            this.CONSUME(tokens_1.PowerFunc);
            this.CONSUME(tokens_1.LParen);
            this.SUBRULE(this.expression, { LABEL: "base" });
            this.CONSUME(tokens_1.Comma);
            this.SUBRULE2(this.expression, { LABEL: "exponent" });
            this.CONSUME(tokens_1.RParen);
        });
        chevrotain_1.Parser.performSelfAnalysis(this);
    }
}
exports.CalculatorPure = CalculatorPure;
exports.parser = new CalculatorPure([]);
//# sourceMappingURL=expression-grammar.js.map