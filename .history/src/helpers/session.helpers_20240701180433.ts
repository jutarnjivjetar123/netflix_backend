import User from "../models/user.model/user.model";
import UserSalt from "../models/user.model/hash.model";
import Session from "../models/user.model/session.model";
import JWTHelper from "./jwtokens.helpers";
import { v4 as uuidv4 } from 'uuid';
export default class SessionHelper {
  public static async generateSession(
    sessionInitializedBy: User,
    ipAddress: string,
    userAgent: string,
    setExpiryDateTime: Date = new Date(Date.now() + 30 * 60 * 1000)
  ): Promise<Session> {
      const sessionUser = sessionInitializedBy;
    const session = new Session();
    session.sessionOwner = sessionInitializedBy;
    session.createdAt = new Date();
    session.lastActivityAt = new Date();
    session.expiresAt = setExpiryDateTime;
    session.ipAddressOfSessionInitialization = ipAddress;
    session.lastIpAddressOfActivity = ipAddress;
    session.userAgent = userAgent;
      session.authToken = await JWTHelper.generateToken({
          uuidv4,
          sessionInitializedByrID,
    });
    s
    return session;
  }
}
