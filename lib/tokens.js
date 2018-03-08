"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
exports.AdditionOperator = chevrotain_1.createToken({
    name: 'AdditionOperator',
    pattern: chevrotain_1.Lexer.NA
});
exports.Plus = chevrotain_1.createToken({
    name: 'Plus',
    pattern: /\+/,
    categories: exports.AdditionOperator
});
exports.Minus = chevrotain_1.createToken({
    name: 'Minus',
    pattern: /-/,
    categories: exports.AdditionOperator
});
exports.MultiplicationOperator = chevrotain_1.createToken({
    name: 'MultiplicationOperator',
    pattern: chevrotain_1.Lexer.NA
});
exports.Multi = chevrotain_1.createToken({
    name: 'Multi',
    pattern: /[\*|\×]/,
    categories: exports.MultiplicationOperator
});
exports.Div = chevrotain_1.createToken({
    name: 'Div',
    pattern: /[\/|\÷]/,
    categories: exports.MultiplicationOperator
});
exports.AngleFunction = chevrotain_1.createToken({
    name: 'AngleFunction',
    pattern: chevrotain_1.Lexer.NA
});
const createAngleFn = (n) => {
    return chevrotain_1.createToken({
        name: `${n.substring(0, 1).toUpperCase()}${n.substring(1)}`,
        pattern: new RegExp(n),
        categories: exports.AngleFunction
    });
};
exports.ASin = createAngleFn('asin');
exports.ACos = createAngleFn('acos');
exports.ATan = createAngleFn('atan');
exports.Sin = createAngleFn('sin');
exports.Cos = createAngleFn('cos');
exports.Tan = createAngleFn('tan');
exports.Factorial = chevrotain_1.createToken({
    name: 'Factorial',
    pattern: /!/
});
exports.Pi = chevrotain_1.createToken({
    name: 'Pi',
    pattern: /π/
});
exports.SuperScriptNumber = chevrotain_1.createToken({
    name: 'SuperScriptNumber',
    pattern: /[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]/
});
exports.SquareRoot = chevrotain_1.createToken({
    name: 'SquareRoot',
    pattern: /√/
});
exports.Percent = chevrotain_1.createToken({
    name: 'Percent',
    pattern: /%/
});
exports.LParen = chevrotain_1.createToken({ name: 'LParen', pattern: /\(/ });
exports.RParen = chevrotain_1.createToken({ name: 'RParen', pattern: /\)/ });
exports.Digit = chevrotain_1.createToken({
    name: 'Digit',
    pattern: /[0-9]+/
});
exports.NumberLiteral = chevrotain_1.createToken({
    name: 'NumberLiteral',
    pattern: /[1-9]\*/
});
exports.DecimalPlace = chevrotain_1.createToken({
    name: 'DecimalPlace',
    pattern: /\./
});
exports.PowerFunc = chevrotain_1.createToken({ name: 'PowerFunc', pattern: /power/ });
exports.LogFunc = chevrotain_1.createToken({ name: 'LogFunc', pattern: /log/ });
exports.LnFunc = chevrotain_1.createToken({ name: 'LnFunc', pattern: /ln/ });
exports.Comma = chevrotain_1.createToken({ name: 'Comma', pattern: /,/ });
exports.Euler = chevrotain_1.createToken({ name: 'Euler', pattern: /e/ });
exports.Abs = chevrotain_1.createToken({ name: 'Abs', pattern: /abs/ });
exports.WhiteSpace = chevrotain_1.createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: chevrotain_1.Lexer.SKIPPED,
    line_breaks: true
});
exports.allTokens = [
    exports.WhiteSpace,
    exports.Plus,
    exports.Minus,
    exports.Multi,
    exports.Div,
    exports.Percent,
    exports.LParen,
    exports.RParen,
    exports.NumberLiteral,
    exports.Digit,
    exports.AdditionOperator,
    exports.MultiplicationOperator,
    exports.PowerFunc,
    exports.LogFunc,
    exports.LnFunc,
    exports.Comma,
    exports.SquareRoot,
    exports.SuperScriptNumber,
    exports.Pi,
    exports.DecimalPlace,
    exports.Factorial,
    exports.AngleFunction,
    exports.ASin,
    exports.ACos,
    exports.ATan,
    exports.Sin,
    exports.Cos,
    exports.Tan,
    exports.Euler,
    exports.Abs
];
exports.CalculatorLexer = new chevrotain_1.Lexer(exports.allTokens);
exports.tokenize = (s) => exports.CalculatorLexer.tokenize(s);
//# sourceMappingURL=tokens.js.map