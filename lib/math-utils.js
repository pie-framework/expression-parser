"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factorialLoop = (num) => {
    var result = 1;
    for (var i = 1; i < num; i++) {
        result = (result * (i + 1));
    }
    return result;
};
//# sourceMappingURL=math-utils.js.map