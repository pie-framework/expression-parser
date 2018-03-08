"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
class SimpleGrammar extends chevrotain_1.Parser {
    constructor(input) {
        super(input, tokens_1.allTokens, { outputCst: true });
        this.expression = this.RULE('expression', () => {
            this.SUBRULE(this.addSubtract);
        });
        this.addSubtract = this.RULE('addSubtract', () => {
            this.SUBRULE(this.multiplyDivide, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(tokens_1.AdditionOperator);
                this.SUBRULE2(this.multiplyDivide, { LABEL: 'rhs' });
            });
        });
        this.multiplyDivide = this.RULE('multiplyDivide', () => {
            this.SUBRULE(this.atomic, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(tokens_1.MultiplicationOperator);
                this.SUBRULE2(this.atomic, { LABEL: 'rhs' });
            });
        });
        this.atomic = this.RULE('atomic', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.number) }
            ]);
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
        chevrotain_1.Parser.performSelfAnalysis(this);
    }
}
exports.SimpleGrammar = SimpleGrammar;
exports.parser = new SimpleGrammar([]);
//# sourceMappingURL=simple-grammar.js.map