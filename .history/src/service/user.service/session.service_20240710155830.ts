import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";

export default class SessionService {
  public static createNewSession(
    userToCreateSessionFor: User,
    ipAddress: string,
    userAgent: string,
    sessionData: string
  ) {
      const sessionCreationResult = await SessionRepo
  }
  public static async checkForAciveSessionByUser(user: User) {
    return;
    await SessionRepository.checkDoesUserHaveActiveSessionByUser(user);
  }
}
