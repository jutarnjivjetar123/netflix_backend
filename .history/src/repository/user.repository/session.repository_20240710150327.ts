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

  public static async getActiveSessionByUser(user: User) {
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
    return await DatabaseConnection.getRepository(UserSession).findOne({
      where: {
        authToken: authToken,
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async getSessionByAuthToken(authToken: string) {
    return await DatabaseConnection.getRepository(UserSession).findOne({
      where: {
        authToken: authToken,
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async getLastSessionByUser(user: User) {
    return await DatabaseConnection.getRepository(UserSession).find({
      where: {
        sessionOwner: user,
      },
      relations: {
        sessionOwner: true,
      },

      order: {
        lastActivityAt: "DESC",
      },
      take: 1,
    });
  }

  public static async getAllSessionsByUser(user: User) {
    return await DatabaseConnection.getRepository(UserSession).find({
      where: {
        sessionOwner: user,
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async deleteActiveSessionByUser(user: User) {
    const sessionToBeDeleted = await this.getActiveSessionByUser(user);
    if (!sessionToBeDeleted) return false;
    const deletionResult = await DatabaseConnection.getRepository(
      UserSession
    ).delete(sessionToBeDeleted);
    if (!deletionResult.raw) return false;
    return true;
  }
  public static async deleteSessionBySession(sessionToBeDeleted: UserSession) {
    const deletionResult = await DatabaseConnection.getRepository(
      UserSession
    ).remove(sessionToBeDeleted);
    return sessionToBeDeleted;
  }
  public static async deleteSessionByAuthToken(authToken: string) {
    const sessionToBeDeleted = await this.getSessionByAuthToken(authToken);
    if (!sessionToBeDeleted) return null;
    return await DatabaseConnection.getRepository(UserSession).remove(
      sessionToBeDeleted
    );
  }

  public static async deleteAllExpiredSessionByUser(user: User)
}
