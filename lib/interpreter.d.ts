import { ICstVisitor } from 'chevrotain';
export declare const BaseCstVisitor: new (...args: any[]) => ICstVisitor<any, any>;
export declare class CalculatorInterpreter extends BaseCstVisitor {
    constructor();
    expression(ctx: any): any;
    additionExpression(ctx: any): any;
    multiplicationExpression(ctx: any): any;
    number(ctx: any): number;
    atomicExpression(ctx: any): any;
    factorial(ctx: any): number;
    pi(ctx: any): number;
    percent(ctx: any): number;
    parenthesisExpression(ctx: any): any;
    logFunction(ctx: any): number;
    powerFunction(ctx: any): number;
    exponent(ctx: any): number;
    exponentialNumber(ctx: any): number;
    squareRootFunction(ctx: any): number;
}
export declare const interpreter: CalculatorInterpreter;
