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
      
      const session = new UserSession();
      session.sessionOwner = sessionInitializedBy;
      
    session.sessionOwner = sessionInitializedBy;
    session.createdAt = new Date();
    session.lastActivityAt = new Date();
    session.expiresAt = setExpiryDateTime;
    session.ipAddressOfSessionInitialization = firstIpAddress;
    session.lastIpAddressOfActivity = lastActiveIpAddress;
    session.userAgent = userAgent;
    session.crsfToken = uuidv4();
    const sessioncrsfToken = session.crsfToken;
    session.authToken = JWTHelper.generateToken(
      {
        sessionOwnerID,
        userSalt,
        sessioncrsfToken,
      },
      (setExpiryDateTime.getTime() / 1000).toString() + "h"
    );
  }
}
