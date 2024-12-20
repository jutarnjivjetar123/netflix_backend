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
    if (!newSessionCreationResult) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Error::SessionService::createNewSession::newSessionCreationResult::Could not create new session for user with ID: " +
          userToCreateSessionFor.userID +
          ", check SessionRepository logs for error message"
      );
    }
    
  }
}
