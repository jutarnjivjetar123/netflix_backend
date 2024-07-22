import User from "../../models/user.model/user.model";
import UserVerificationToken from "../../models/user.model/verificationToken.model";
import { DatabaseConnection } from "../../database/config.database";

enum TokenType {
  SESSION_VERIFICATION = "Session Verification",
}
export default class VerificationTokenRepository {
  public static async createNewVerificationToken(
    user: User,
    tokenType: string,
    expiryTime: Date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
  ): Promise<UserVerificationToken | null> {
    const newVerificationToken = new UserVerificationToken();
    newVerificationToken.tokenOwner = user;
    newVerificationToken.tokenType = TokenType.SESSION_VERIFICATION;
    newVerificationToken.createdAt = new Date();
    newVerificationToken.expiresAt = new Date(
      newVerificationToken.createdAt.getTime() + 1000 * 60 * 60 * 24
    );

    const newTokenSavingResult = DatabaseConnection.getRepository(
      UserVerificationToken
    ).save(newVerificationToken);

    if (!newTokenSavingResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewVerificationToken::newTokenSavingResult::Could not create new verification token"
      );
      return null;
    }
    console.log(
      new Date() +
        " -> LOG::SUCCESS::UserRepository::createNewVerificationToken::newTokenSavingResult::New verification token created for user, with following parameters: " +
        JSON.stringify({
        
          user: user,
          tokenType: tokenType,
          expiryTime: expiryTime,
        })
    );
    return newVerificationToken;
  }
}
