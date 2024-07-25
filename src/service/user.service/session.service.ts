import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";
import { DatabaseConnection } from "database/config.database";
import SessionRepo from "../../../.history/src/repository/user.repository/session.repository_20240710115711";

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

  public static async getSessionByUser(
    user: User
  ): Promise<UserSession | null> {
    return await SessionRepository.getSessionByUser(user);
  }

  public static async extendSessionExpiryTime(
    sessionToSetNewTime: UserSession,
    expiresAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  ) {
    return await SessionRepository.setSessionExpiryTimeBySession(
      sessionToSetNewTime,
      expiresAt
    );
  }

  public static async deleteSessionByUser(userToDeleteSessionFor: User) {
    const sessionToDelete = await SessionRepository.getSessionByUser(
      userToDeleteSessionFor
    );
    if (!sessionToDelete) return false;
    return await SessionRepository.deleteSession(sessionToDelete);
  }
}
