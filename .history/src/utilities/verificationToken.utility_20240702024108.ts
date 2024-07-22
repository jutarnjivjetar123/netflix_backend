import JWTHelper from "helpers/jwtokens.helpers";
import User from "../models/user.model/user.model";
import UserVerificationToken from "../models/user.model/verificationToken.model";
import VerificationTokenRepository from "../repository/user.repository/verificationToken.repository";
import UserHash from "models/user.model/hash.model";
export default class VerificationTokenUtility {
  public static async createVerificationTokenForUserSessionVerification(
    user: User
  ): Promise<UserVerificationToken | null> {
      const userSalt = await User
      const jwtToken = await JWTHelper.generateToken(
          {
              user: user.userID,

          }
      );
    const createVerificationTokenResult =
      await VerificationTokenRepository.createNewVerificationTokenForSession(
          user,
        
      );
  }
}
