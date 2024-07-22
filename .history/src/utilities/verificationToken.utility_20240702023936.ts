import User from "../models/user.model/user.model";
import UserVerificationToken from "../models/user.model/verificationToken.model";
import VerificationTokenRepository from "../repository/user.repository/verificationToken.repository";
export default class VerificationTokenUtility {
  public static async createVerificationTokenForUserSessionVerification(
    user: User
  ): Promise<UserVerificationToken | null> {
      const jwtToken = await 
    const createVerificationTokenResult =
      await VerificationTokenRepository.createNewVerificationTokenForSession(
          user,
        
      );
  }
}
