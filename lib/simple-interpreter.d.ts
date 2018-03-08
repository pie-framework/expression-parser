import { ICstVisitor } from 'chevrotain';
export declare const BaseCstVisitor: new (...args: any[]) => ICstVisitor<any, any>;
export declare class SimpleInterpreter extends BaseCstVisitor {
    constructor();
    expression(ctx: any): any;
    addSubtract(ctx: any): any;
    multiplyDivide(ctx: any): any;
    atomic(ctx: any): any;
    number(ctx: any): any;
    dotFloat(ctx: any): number;
    float(ctx: any): number;
    int(ctx: any): number;
}
export declare const interpreter: SimpleInterpreter;
