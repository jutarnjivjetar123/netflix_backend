import User from "../models/user.model/user.model";
import UserSalt from "../models/user.model/hash.model";
import Session from "../models/user.model/session.model";
import JWTHelper from "./jwtokens.helpers";
import { v4 as uuidv4 } from "uuid";
export default class SessionHelper {
  public static async generateSession(
    sessionInitializedBy: User,
    firstIpAddress: string,
    lastActiveIpAddress: string,
    userAgent: string,
    setExpiryDateTime: Date = new Date(Date.now() + 30 * 60 * 1000)
  ): Promise<Session> {
      
      
    const session = new Session();
    session.sessionOwner = sessionInitializedBy;
    session.createdAt = new Date();
    session.lastActivityAt = new Date();
    session.expiresAt = setExpiryDateTime;
      session.ipAddressOfSessionInitialization = firstIpAddress;
      session.lastIpAddressOfActivity = lastActiveIpAddress;
      session.userAgent = userAgent;
      session.authToken = JWTHelper.generateToken({
          
      });
  }
}