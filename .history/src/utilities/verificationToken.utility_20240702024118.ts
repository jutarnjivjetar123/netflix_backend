import JWTHelper from "helpers/jwtokens.helpers";
import User from "../models/user.model/user.model";
import UserVerificationToken from "../models/user.model/verificationToken.model";
import VerificationTokenRepository from "../repository/user.repository/verificationToken.repository";
import UserHash from "models/user.model/hash.model";
import UserService from "service/user.service/user.service";
export default class VerificationTokenUtility {
  public static async createVerificationTokenForUserSessionVerification(
    user: User
  ): Promise<UserVerificationToken | null> {
      const userSalt = await UserRepo
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
