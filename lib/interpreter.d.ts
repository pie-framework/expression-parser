import { ICstVisitor } from 'chevrotain';
import { AngleMode } from './angle-mode';
export declare const BaseCstVisitor: new (...args: any[]) => ICstVisitor<any, any>;
export declare class Opts {
    readonly angleMode: AngleMode;
    constructor(angleMode: AngleMode);
}
export declare class CalculatorInterpreter extends BaseCstVisitor {
    constructor();
    expression(ctx: any, opts: Opts): any;
    additionExpression(ctx: any, opts: Opts): any;
    multiplicationExpression(ctx: any, opts: Opts): any;
    number(ctx: any): any;
    dotFloat(ctx: any): number;
    float(ctx: any): number;
    int(ctx: any): number;
    atomicExpression(ctx: any, opts: Opts): any;
    factorial(ctx: any, opts: Opts): number;
    pi(ctx: any, opts: Opts): number;
    euler(ctx: any, opts: Opts): number;
    percent(ctx: any, opts: Opts): number;
    parenthesisExpression(ctx: any, opts: Opts): any;
    angleFunction(ctx: any, opts: Opts): number;
    logFunction(ctx: any, opts: Opts): number;
    lnFunction(ctx: any, opts: Opts): number;
    abs(ctx: any, opts: Opts): number;
    powerFunction(ctx: any, opts: Opts): number;
    exponent(ctx: any, opts: Opts): number;
    exponentialNumber(ctx: any, opts: Opts): number;
    squareRootFunction(ctx: any, opts: Opts): number;
}
export declare const interpreter: CalculatorInterpreter;
