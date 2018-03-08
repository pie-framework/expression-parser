"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("./tokens");
const grammar_1 = require("./grammar");
const interpreter_1 = require("./interpreter");
const angle_mode_1 = require("./angle-mode");
exports.AngleMode = angle_mode_1.AngleMode;
const debug_1 = require("debug");
const log = debug_1.default('expression-parser');
const { DEGREES, RADIANS } = angle_mode_1.AngleMode;
exports.calculate = (text, opts = { angleMode: RADIANS }) => {
    const lexResult = tokens_1.tokenize(text);
    grammar_1.parser.input = lexResult.tokens;
    const cst = grammar_1.parser.expression();
    const value = interpreter_1.interpreter.visit(cst, new interpreter_1.Opts(opts.angleMode));
    const error = (grammar_1.parser.errors.length > 0) ? {
        e: new Error('Error parsing expression'),
        start: undefined,
        end: undefined
    } : undefined;
    if (grammar_1.parser.errors.length > 0) {
        log('errors', grammar_1.parser.errors);
    }
    return { value, error };
};
//# sourceMappingURL=index.js.map