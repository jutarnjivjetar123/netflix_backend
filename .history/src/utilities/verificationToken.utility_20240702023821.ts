import User from "../models/user.model/user.model";
import UserVerificationToken from "../models/user.model/verificationToken.model";

export default class VerificationTokenUtility {
    public static async createVerificationTokenForUserSessionVerification(user: User): Promise<UserVerificationToken | null> { 
        

    };
}
