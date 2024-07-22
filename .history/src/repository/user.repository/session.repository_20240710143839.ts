import { v4 as uuidv4 } from "uuid";

import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/session.model";
import UserSession from "../../models/user.model/session.model";
import { MoreThan } from "typeorm";

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

    const savedSession = await DatabaseConnection.getRepository(UserSession)
      .save(newSession)
      .then(() => {
        return newSession;
      })
      .catch((error) => {
        console.log(
          new Date() +
            " -> LOG::Error::SessionRepository::createNewSessionForUser::savedSession::TryCatch exception::Error saving session, error message: " +
            error.message
        );
        return null;
      });
  }
  public static async checkDoesUserHaveActiveSessionByUser(
    userToCheckSessionStatusFor: User
  ) {
    return await DatabaseConnection.getRepository(UserSession).exists({
      where: {
        sessionOwner: userToCheckSessionStatusFor,
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async checkDoesUserHaveActiveSessionByAuthToken(
    authToken: string
  ) {
    return await DatabaseConnection.getRepository(UserSession).exists({
      where: {
        authToken: authToken,
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async getCurrentSessionByUser(user: User) {
    return await DatabaseConnection.getRepository(UserSession).findOne({
      where: {
        sessionOwner: user,
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async getActiveSessionByAuthToken(authToken: string) { 
    return await 
  }
}
