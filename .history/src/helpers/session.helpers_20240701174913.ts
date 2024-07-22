import User from "../models/user.model/user.model";
import UserSalt from "../models/user.model/hash.model";
import Session from "../models/user.model/session.model";

export default class SessionHelper {
  public static async generateSession(
    sessionOwner: User,
    ipAddress: string,
    userAgent: string,
    setExpiryDateTime: Date = new Date(Date.now() + 30 * 60 * 1000)
  ): Promise<Session> {
    const session = new Session();
      session.sessionOwner = sessionOwner;
      session.createdAt = new Date();
      

    return session;
  }
}
