import { Lexer, Parser } from 'chevrotain';
export declare const CalculatorLexer: Lexer;
export declare class CalculatorPure extends Parser {
    expression: any;
    private exponent;
    private parenthesisExpression;
    private powerFunction;
    private logFunction;
    private squareRootFunction;
    private pi;
    private atomicExpression;
    private exponentialNumber;
    private number;
    private factorial;
    private additionExpression;
    private multiplicationExpression;
    private percent;
    constructor(input: any);
}
export declare const parser: CalculatorPure;
