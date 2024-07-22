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
    const session = await SessionRepository.getSessionByUser(
      userToCheckSessionFor
    );
    if (!session.sessionID) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Info::SessionService::isSessionActiveForUser::session::No session active or not was found for user with ID: " +
          userToCheckSessionFor.userID
      );
      return false;
    }
    if (session.expiresAt < new Date()) { 
      console.log(
        "[LOG-DATA] - " +
        new Date() +
        " -> LOG::Info::SessionService::isSessionActiveForUser::session::Found expired session for user with ID: " +
        userToCheckSessionFor.userID + ", session data: " + JSON.stringify();
      );
      return false;
    }
  }
  public static async deleteSessionForUser_WithActiveSessionChecking(
    userToDeleteSessionFor: User
  ) {}
  public static async deleteSessionForUser_NoActiveSessionChecking(
    userToDeleteSessionFor: User
  ) {}
}
