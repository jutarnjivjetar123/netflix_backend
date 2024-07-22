import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";

export default class SessionService {
  public static async createNewSession(
    userToCreateSessionFor: User,
    expiresAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    initialIpAddress: string,
    userAgent: string = "",
    sessionData: string = null
  ) {
    const newSessionCreationResult = await SessionRepository.createNewSession(
      userToCreateSessionFor,
      expiresAt,
      initialIpAddress,
      userAgent,
      sessionData
    );

    if (!newSessionCreationResult.sessionID) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Error::SessionService::createNewSession::newSessionCreationResult::Could not create new session for user with ID: " +
          userToCreateSessionFor.userID +
          ", check SessionRepository logs for error message"
      );
    }
    return newSessionCreationResult;
  }
  public static async isSessionActiveForUser(userToCheckSessionFor: User) {
    const session = await SessionRepository.getSessionByUser(userToCheckSessionFor);
    if()
  }
  public static async deleteSessionForUser_WithActiveSessionChecking(
    userToDeleteSessionFor: User
  ) {}
  public static async deleteSessionForUser_NoActiveSessionChecking(
    userToDeleteSessionFor: User
  ) {}
}
