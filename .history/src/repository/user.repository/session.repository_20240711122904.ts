import { v4 as uuidv4 } from "uuid";

import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/session.model";
import UserSession from "../../models/user.model/session.model";
import { MoreThan } from "typeorm";
import ReturnObjectHandler from "../../utilities/returnObject.utility";

export default class SessionRepository {
  public static async createNewSession(
    userToCreateSessionFor: User,
    expiresAt: Date = new Date(),
    initialIpAddress: string,
    userAgent: string = "",
    sessionData: string = null
  ) {
    const newSession = new UserSession();
    newSession.sessionOwner = userToCreateSessionFor;
    newSession.createdAt = new Date();
    newSession.lastActivityAt = new Date();
    newSession.expiresAt = expiresAt;
    newSession.ipAddressOfSessionInitialization = initialIpAddress;
    newSession.lastIpAddressOfActivity = initialIpAddress;
    newSession.userAgent = userAgent;
    newSession.authToken = uuidv4();
    newSession.crsfToken = uuidv4();
    newSession.sessionData = sessionData;

    await DatabaseConnection.getRepository(UserSession).save(newSession).then(() => { }).catch((error) => { 
      console.log("[LOG-DATA] - "  + new Date() + " -> LOG::Error::SessionRepository::createNewSession::TryCatch Exception::Could not create new UserSession ")
    });
    
  }
}