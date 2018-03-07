"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angle_mode_1 = require("./angle-mode");
const debug_1 = require("debug");
const log = debug_1.default('expression-parser:math-utils');
const { DEGREES, RADIANS } = angle_mode_1.AngleMode;
exports.factorialLoop = (num) => {
    var result = 1;
    for (var i = 1; i < num; i++) {
        result = (result * (i + 1));
    }
    return result;
};
exports.toRadians = (degrees) => degrees * Math.PI / 180;
const angleFn = (label, fn) => (input, mode) => {
    log('[angleFn] ', label, ' input: ', input, 'mode: ', mode, ' DEGREES: ', DEGREES);
    const angle = mode === DEGREES ? exports.toRadians(input) : input;
    return parseFloat(fn(angle).toFixed(14));
};
exports.sin = angleFn('sin', Math.sin);
exports.cos = angleFn('cos', Math.cos);
exports.tan = angleFn('tan', Math.tan);
exports.asin = angleFn('asin', Math.asin);
exports.acos = angleFn('acos', Math.acos);
exports.atan = angleFn('atan', Math.atan);
//# sourceMappingURL=math-utils.js.map