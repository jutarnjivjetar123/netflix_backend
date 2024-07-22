import User from "../../models/user.model/user.model";
import UserVerificationToken from "../../models/user.model/verificationToken.model";
import { DatabaseConnection } from "../../database/config.database";

export default class VerificationTokenRepository { 

    public static async createNewVerificationToken(user: User, tokenType: string, expiryTime: Date = new Date( new Date(). + 1000 * 60 * 60 * 24)): Promise<UserVerificationToken | null> {
        const newVerificationToken = new UserVerificationToken();
        newVerificationToken.tokenOwner = user;
        newVerificationToken.tokenType = "sessionVerification";
        newVerificationToken.createdAt = new Date();
        newVerificationToken.expiresAt = new Date(newVerificationToken.createdAt.getTime() + 1000 * 60 * 60 * 24);

    
}