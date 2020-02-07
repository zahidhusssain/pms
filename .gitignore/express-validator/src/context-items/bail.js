"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
class Bail {
    run(context) {
        if (context.errors.length > 0) {
            throw new base_1.ValidationHalt();
        }
        return Promise.resolve();
    }
}
exports.Bail = Bail;
