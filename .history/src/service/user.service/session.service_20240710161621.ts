import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";
import Session from '../../../.history/src/repository/session.repository_20240503144635';

export default class SessionService {
  public static async createNewSession(
    userToCreateSessionFor: User,
    ipAddress: string,
    userAgent: string,
    sessionData: string
  ) {
    const sessionCreationResult =
      await SessionRepository.createNewSessionForUser(
        userToCreateSessionFor,
        ipAddress,
        userAgent,
        sessionData
      );
    return sessionCreationResult;
  }
  public static async checkForActiveSessionByUser(user: User) {
    return await SessionRepository.checkDoesUserHaveActiveSessionByUser(user);
  }
  public static async getActiveSessionByUser(user: User) { 
    return await SessionR
  }
}
