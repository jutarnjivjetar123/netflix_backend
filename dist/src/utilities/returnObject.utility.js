"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReturnObjectHandler {
    message;
    returnValue;
    constructor(message, returnValue) {
        this.message = message;
        this.returnValue = returnValue;
    }
    getMessage() {
        return this.message;
    }
    getReturnValue() {
        return this.returnValue;
    }
    setMessage(message) {
        this.message = message;
    }
    setReturnValue(value) {
        this.returnValue = value;
    }
}
exports.default = ReturnObjectHandler;
//# sourceMappingURL=returnObject.utility.js.map