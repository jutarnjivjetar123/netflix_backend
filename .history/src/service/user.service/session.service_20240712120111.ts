import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";
import { DatabaseConnection } from "database/config.database";

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
    if (!session) {
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
          userToCheckSessionFor.userID +
          ", session data: " +
          JSON.stringify({
            sessionID: session.sessionID,
            authToken: session.authToken,
            crsfToken: session.crsfToken,
            expiryDateTime: session.expiresAt,
            sessionInitializedByUser: session.sessionOwner.userID,
          })
      );
      return false;
    }
    console.log(
      "[LOG-DATA] - " +
        new Date() +
        " -> LOG::Info::SessionService::isSessionActiveForUser::session::Found active session for user with ID: " +
        userToCheckSessionFor.userID +
        ", session data: " +
        JSON.stringify({
          sessionID: session.sessionID,
          authToken: session.authToken,
          crsfToken: session.crsfToken,
          expiryDateTime: session.expiresAt,
          sessionInitializedByUser: session.sessionOwner.userID,
        })
    );
    return true;
  }
  public static async deleteSessionForUser_WithActiveSessionChecking(
    userToDeleteSessionFor: User
  ) {
    if (await this.isSessionActiveForUser(userToDeleteSessionFor)) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Info::SessionService::deleteSessionForUser_WithActiveSessionChecking::Could not delete session for user with ID: " +
          userToDeleteSessionFor.userID +
          " because has an active session"
      );
      return false;
    }
    const sessionDeletionResult = await SessionRepository.deleteSessionByUser(
      userToDeleteSessionFor
    );
    if (!sessionDeletionResult) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Info::SessionService::deleteSessionForUser_WithActiveSessionChecking::sessionDeletionResult::Could not delete session for user with ID: " +
          userToDeleteSessionFor.userID +
          ", check ServiceRepository for more information"
      );
      return false;
    }
    console.log(
      "[LOG-DATA] - " +
        new Date() +
        " -> LOG::Info::SessionService::deleteSessionForUser_WithActiveSessionChecking::Session for user with ID: " +
        userToDeleteSessionFor.userID +
        " was successfully deleted"
    );
    return true;
  }
  public static async deleteSessionForUser_NoActiveSessionChecking(
    userToDeleteSessionFor: User
  ) {
    const sessionDeletionResult = await SessionRepository.deleteSessionByUser(
      userToDeleteSessionFor
    );
    if (!sessionDeletionResult) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Info::SessionService::deleteSessionForUser_NoActiveSessionChecking::sessionDeletionResult::Could not delete session for user with ID: " +
          userToDeleteSessionFor.userID +
          ", check ServiceRepository for more information"
      );
      return false;
    }
    console.log(
      "[LOG-DATA] - " +
        new Date() +
        " -> LOG::Info::SessionService::deleteSessionForUser_NoActiveSessionChecking::Session for user with ID: " +
        userToDeleteSessionFor.userID +
        " was successfully deleted"
    );
    return true;
  }
  public static async getSessionByUser(userToGetSessionFor: User) {
    return await SessionRepository.getSessionByUser(userToGetSessionFor);
  }
  public static async extendSessionLifespanByUser(
    sessionOwnedByUser: User,
    extendSessionByDateTime: Date = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    )
  ) {
    return await SessionRepository.setSessionExpiryTimeByUser(
      sessionOwnedByUser,
      extendSessionByDateTime
    );
  }
}
