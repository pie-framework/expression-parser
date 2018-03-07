"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("./tokens");
const grammar_1 = require("./grammar");
const interpreter_1 = require("./interpreter");
const angle_mode_1 = require("./angle-mode");
exports.AngleMode = angle_mode_1.AngleMode;
const { DEGREES, RADIANS } = angle_mode_1.AngleMode;
exports.calculate = (text, opts = { angleMode: RADIANS }) => {
    const lexResult = tokens_1.tokenize(text);
    grammar_1.parser.input = lexResult.tokens;
    const cst = grammar_1.parser.expression();
    const value = interpreter_1.interpreter.visit(cst, new interpreter_1.Opts(opts.angleMode));
    return { value, lexResult, parseErrors: grammar_1.parser.errors };
};
//# sourceMappingURL=index.js.map