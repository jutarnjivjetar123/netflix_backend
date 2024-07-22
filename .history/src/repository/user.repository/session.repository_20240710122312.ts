import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/session.model";
import UserSession from "../../models/user.model/session.model";

export default class SessionRepository {
  public static createNewSessionForUser(
    userToCreateSessionFor: User,
    startIpAddress: string,
    userAgent: string,
    additionalData: string
  ) {
      const newSession = new UserSession();
      newSession.sessionOwner = userToCreateSessionFor;
      newSession.createdAt = new Date(Date.now() + 1 * 60 * 60 );
      newSession.lastActivityAt = new Date();
      newSession.expiresAt = 
  }
  public static checkDoesUserHaveActiveSession(
    userToCheckSessionStatusFor: User
  ) {}
  public static deactivateCurrentSessionByUser(user: User) {}
  public static deactivateCurrentSessionBySession(session: UserSession) {}
  public static getActiveSessionByUser(user: User) {}
  public static getAllSessionsByUser(user: User) {}
  public static getSessionBySessionId(sessionId: string) {}
  public static suspendSessionByUser(user: string) {}
}
