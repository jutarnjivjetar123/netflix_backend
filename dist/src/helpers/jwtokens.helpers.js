"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class JWTHelper {
    static generateToken(payload, expiryTime = "1h") {
        return jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: expiryTime,
        });
    }
    static validateToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError)
                return "Error: token has expired";
            return "Error: " + error;
        }
    }
    static getUserSaltFromToken(token) {
        const decodedToken = JWTHelper.validateToken(token);
        let userSalt;
        if (typeof decodedToken === "string") {
            // Handle case where token is a string
            // For example, you may want to throw an error or handle it accordingly
            console.log("Token is string, with error: " + decodedToken);
            return null;
        }
        else {
            // Handle case where token is a JwtPayload
            userSalt = decodedToken.salt;
            console.log("User salt: " + userSalt);
        }
        return userSalt;
    }
}
exports.default = JWTHelper;
//# sourceMappingURL=jwtokens.helpers.js.map