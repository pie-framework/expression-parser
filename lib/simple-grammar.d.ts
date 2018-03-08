import { Parser } from 'chevrotain';
export declare class SimpleGrammar extends Parser {
    expression: any;
    number: any;
    float: any;
    int: any;
    dotFloat: any;
    addSubtract: any;
    multiplyDivide: any;
    atomic: any;
    constructor(input: any);
}
export declare const parser: SimpleGrammar;
