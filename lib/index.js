"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_grammar_1 = require("./expression-grammar");
const interpreter_1 = require("./interpreter");
exports.calculate = (text) => {
    const lexResult = expression_grammar_1.CalculatorLexer.tokenize(text);
    expression_grammar_1.parser.input = lexResult.tokens;
    const cst = expression_grammar_1.parser.expression();
    const value = interpreter_1.interpreter.visit(cst);
    return { value, lexResult, parseErrors: expression_grammar_1.parser.errors };
};
//# sourceMappingURL=index.js.map