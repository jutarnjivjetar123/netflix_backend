import User from "../../models/user.model/user.model";
import UserVerificationToken from "../../models/user.model/verificationToken.model";
import { DatabaseConnection } from "../../database/config.database";

enum TokenType {
  SESSION_VERIFICATION = "Session Verification",
  USER_AUTHENTICATION = "User Authentication",
  USER_AUTHORIZATION = "User Authorization",
  PASSWORD_RESET = "Password Reset",
  EMAIL_RESET = "Email Reset",
  PHONE_NUMBER_RESET = "Phone Number Reset",
}
export default class VerificationTokenRepository {
  public static async createNewVerificationTokenForSession(
    user: User,
    authToken: string,
    expiryTime: Date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
  ): Promise<UserVerificationToken | null> {
    const newVerificationToken = new UserVerificationToken();
    newVerificationToken.createdAt = new Date();
    newVerificationToken.expiresAt = expiryTime;
    newVerificationToken.tokenOwner = user;
    newVerificationToken.tokenType = TokenType.SESSION_VERIFICATION;
    newVerificationToken.tokenPayload = authToken;

    const newVerificationTokenCreationResult = DatabaseConnection.getRepository(
      UserVerificationToken
    ).save(newVerificationToken);
      
      if(!new)
  }
}
