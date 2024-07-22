"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_model_1 = __importDefault(require("../models/user.model/session.model"));
const jwtokens_helpers_1 = __importDefault(require("./jwtokens.helpers"));
const uuid_1 = require("uuid");
const user_repository_1 = __importDefault(require("repository/user.repository/user.repository"));
class SessionHelper {
    static async generateSession(sessionInitializedBy, firstIpAddress, lastActiveIpAddress, userAgent, setExpiryDateTime = new Date(Date.now() + 30 * 60 * 1000)) {
        const sessionOwnerID = sessionInitializedBy.userID;
        const userSalt = await user_repository_1.default.getUserSaltByUser(sessionInitializedBy);
        if (!userSalt) {
            console.log(new Date() +
                " -> LOG::ERROR::UserRepository::getUserSaltByUser::User salt with user ID: " +
                sessionInitializedBy.userID +
                " not found");
            return null;
        }
        const session = new session_model_1.default();
        session.sessionOwner = sessionInitializedBy;
        session.createdAt = new Date();
        session.lastActivityAt = new Date();
        session.expiresAt = setExpiryDateTime;
        session.ipAddressOfSessionInitialization = firstIpAddress;
        session.lastIpAddressOfActivity = lastActiveIpAddress;
        session.userAgent = userAgent;
        session.crsfToken = (0, uuid_1.v4)();
        const sessioncrsfToken = session.crsfToken;
        session.authToken = jwtokens_helpers_1.default.generateToken({
            sessionOwnerID,
            userSalt,
            sessioncrsfToken,
        }, (setExpiryDateTime.getTime() / 1000).toString() + "h");
    }
}
exports.default = SessionHelper;
//# sourceMappingURL=session.helpers.js.map