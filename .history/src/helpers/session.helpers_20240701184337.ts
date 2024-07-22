import User from "../models/user.model/user.model";
import UserSalt from "../models/user.model/hash.model";
import Session from "../models/user.model/session.model";
import JWTHelper from "./jwtokens.helpers";
import { v4 as uuidv4 } from "uuid";
export default class SessionHelper {
  public static async generateSession(
    sessionInitializedBy: User,
    ipAddress: string,
    userAgent: string,
    setExpiryDateTime: Date = new Date(Date.now() + 30 * 60 * 1000)
  ): Promise<Session> {
   
  }
}
