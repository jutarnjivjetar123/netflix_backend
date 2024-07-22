import JWTHelper from "helpers/jwtokens.helpers";
import User from "../models/user.model/user.model";
import UserVerificationToken from "../models/user.model/verificationToken.model";
import VerificationTokenRepository from "../repository/user.repository/verificationToken.repository";
import UserRepository from "repository/user.repository/user.repository";
export default class VerificationTokenUtility {
  public static async createVerificationTokenForUserSessionVerification(
    user: User
  ): Promise<UserVerificationToken | null> {
    const userSalt = await UserRepository.getUserSaltByUser(user);
    const jwtToken = await JWTHelper.generateToken({
      user: user.userID,
      salt: userSalt,
      randomValue: Math.random().toString(),
    });
    const createVerificationTokenResult =
      await VerificationTokenRepository.createNewVerificationTokenForSession(
        user,
        jwtToken
        );
      if (!createVerificationTokenResult) { 
          
      }
  }
}
