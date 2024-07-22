"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtokens_helpers_1 = __importDefault(require("helpers/jwtokens.helpers"));
const verificationToken_repository_1 = __importDefault(require("../repository/user.repository/verificationToken.repository"));
const user_repository_1 = __importDefault(require("repository/user.repository/user.repository"));
class VerificationTokenUtility {
    static async createVerificationTokenForUserSessionVerification(user) {
        const userSalt = await user_repository_1.default.getUserSaltByUser(user);
        const jwtToken = await jwtokens_helpers_1.default.generateToken({
            user: user.userID,
            salt: userSalt,
            randomValue: Math.random().toString(),
        });
        const createVerificationTokenResult = await verificationToken_repository_1.default.createNewVerificationTokenForSession(user, jwtToken);
        if (!createVerificationTokenResult) {
            console.log(new Date() +
                " -> LOG::Error::VerificationTokenUtility::createVerificationTokenForUserSessionVerification::createVerificationTokenResult::Could not create new verification token");
            return null;
        }
        return createVerificationTokenResult;
    }
}
exports.default = VerificationTokenUtility;
//# sourceMappingURL=verificationToken.utility.js.map