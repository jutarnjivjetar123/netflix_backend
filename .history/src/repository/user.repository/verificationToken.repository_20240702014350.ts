import User from "../../models/user.model/user.model";
import UserVerificationToken from "../../models/user.model/verificationToken.model";
import { DatabaseConnection } from "../../database/config.database";

export default class VerificationTokenRepository { 

    public static async createNewVerificationToken(user: User): Promise<UserVerificationToken | null> {
        const newVerificationToken = new UserVerificationToken();
        newVerificationToken.tokenOwner = user;
        newVerificationToken.tokenType = "sessionVerification";
        newVerificationToken.createdAt = new Date();
        new
    
}