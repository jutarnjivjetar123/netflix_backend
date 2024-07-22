"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class EncryptionHelpers {
    static async hashPassword(password) {
        return await bcrypt_1.default.hash(password, 12);
    }
    static async validatePassword(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
    static async generateSalt(numberOfRounds = 12) {
        return bcrypt_1.default.genSalt(12);
    }
}
exports.default = EncryptionHelpers;
//# sourceMappingURL=encryption.helper.js.map