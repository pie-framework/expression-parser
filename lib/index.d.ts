import { ILexingResult, IRecognitionException } from 'chevrotain';
export declare const calculate: (text: string) => {
    value: any;
    lexResult: ILexingResult;
    parseErrors: IRecognitionException[];
};
