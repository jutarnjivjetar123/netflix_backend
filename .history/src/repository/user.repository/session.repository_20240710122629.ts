import { v4 as uuidv4 } from "uuid";

import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/session.model";
import UserSession from "../../models/user.model/session.model";

export default class SessionRepository {
  public static async createNewSessionForUser(
    userToCreateSessionFor: User,
    startIpAddress: string,
    userAgent: string,
    additionalData: string
  ) {
    const newSession = new UserSession();
    newSession.sessionOwner = userToCreateSessionFor;
    newSession.createdAt = new Date();
    newSession.lastActivityAt = new Date();
    newSession.expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    newSession.ipAddressOfSessionInitialization = startIpAddress;
    newSession.lastIpAddressOfActivity = startIpAddress;
    newSession.userAgent = userAgent;
    newSession.authToken = uuidv4();
    newSession.crsfToken = uuidv4();

    const savedSession = await DatabaseConnection.getRepository(
      UserSession
    ).save(newSession);
    
  }
  public static checkDoesUserHaveActiveSession(
    userToCheckSessionStatusFor: User
  ) {}
  // public static deactivateCurrentSessionByUser(user: User) {}
  // public static deactivateCurrentSessionBySession(session: UserSession) {}
  // public static getActiveSessionByUser(user: User) {}
  // public static getAllSessionsByUser(user: User) {}
  // public static getSessionBySessionId(sessionId: string) {}
  // public static suspendSessionByUser(user: string) {}
}