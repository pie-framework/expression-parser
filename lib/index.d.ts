import { AngleMode } from './angle-mode';
export { AngleMode };
export declare type CalculateResult = {
    value: string;
    error?: {
        e: Error;
        start: number;
        end: number;
    };
};
export declare const calculate: (text: string, opts?: {
    angleMode: AngleMode;
}) => CalculateResult;
