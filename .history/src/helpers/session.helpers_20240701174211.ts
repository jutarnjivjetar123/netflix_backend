import { v4 as uuidv4 } from "uuid";

import UserSession from "../models/user.model/session.model";
import User from "../models/user.model/user.model";
interface Session {
  sessionID: string;
  sessionOwner: User;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  ipAddressOfSessionInitialization: string;
  lastIpAddressOfActivity: string;
  userAgent: string;
  authToken: string;
  crsfToken: string;
  additionalData: string;
}

class SessionHelper {
  private static generatePublicSessionID(): string {
    return uuidv4();
  }
    
    pri
}
