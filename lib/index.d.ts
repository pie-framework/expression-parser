import { ILexingResult, IRecognitionException } from 'chevrotain';
import { AngleMode } from './angle-mode';
export { AngleMode };
export declare const calculate: (text: string, opts?: {
    angleMode: AngleMode;
}) => {
    value: any;
    lexResult: ILexingResult;
    parseErrors: IRecognitionException[];
};
