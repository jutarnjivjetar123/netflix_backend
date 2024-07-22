import User from "../../models/user.model/session.model";
import UserSession from "../../models/user.model/session.model";

export default class SessionRepository {
  public static async createSession(
    sessionInitializedBy: User,
    firstIpAddress: string,
    lastActiveIpAddress: string,
    userAgent: string,
    setExpiryDateTime: Date = new Date(Date.now() + 30 * 60 * 1000),
    authenticationToken: string,
    crsfToken: string,
    additionalData?: string
  ) {
      
    const newSession: UserSession = new UserSession();
    newSession.sessionOwner = sessionInitializedBy;
    
  }
}
