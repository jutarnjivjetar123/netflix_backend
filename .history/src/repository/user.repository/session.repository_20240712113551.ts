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
    expiresAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    initialIpAddress: string,
    userAgent: string = "",
    sessionData: string = null
  ): Promise<UserSession | null> {
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

    await DatabaseConnection.getRepository(UserSession)
      .save(newSession)
      .then(() => {})
      .catch((error) => {
        console.log(
          "[LOG-DATA] - " +
            new Date() +
            " -> LOG::Error::SessionRepository::createNewSession::TryCatch Exception::Could not create new UserSession entity instance, error: " +
            error.message
        );
        return null;
      });
    console.log(
      "[LOG-DATA] - " +
        new Date() +
        " -> LOG::Success::SessionRepository::createNewSession::Created new UserSession entity instance successfully, created UserSession object instance ID: " +
        newSession.sessionID
    );
    return newSession;
  }
  public static async getSessionByUser(
    userToGetSessionFor: User
  ): Promise<UserSession | null> {
    return await DatabaseConnection.getRepository(UserSession).findOne({
      where: {
        sessionOwner: userToGetSessionFor,
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async deleteSessionByUser(
    userToDeleteSessionFor: User
  ): Promise<boolean> {
    const sessionToDelete = await this.getSessionByUser(userToDeleteSessionFor);
    if (!sessionToDelete.sessionID) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Info::SessionRepository::deleteSessionByUser::sessionToDelete::No current session for user with ID: " +
          userToDeleteSessionFor.userID +
          " was found, so delete operation could not be executed"
      );
      return false;
    }
    await DatabaseConnection.getRepository(UserSession)
      .remove(sessionToDelete)
      .then(() => {
        console.log(
          "[LOG-DATA] - " +
            new Date() +
            " -> LOG::Info::SessionRepository::deleteSessionByUser::sessionToDelete::Session for user with ID: " +
            userToDeleteSessionFor.userID +
            " was found and removed, removed session ID: " +
            sessionToDelete.sessionID
        );
      })
      .catch((error) => {
        console.log(
          "[LOG-DATA] - " +
            new Date() +
            " -> LOG::Info::SessionRepository::deleteSessionByUser::sessionToDelete::Error occured while deleting session for user with ID: " +
            userToDeleteSessionFor.userID +
            ", operation was canceled, erorr: " +
            error.message
        );
        return false;
      });
    return true;
  }

  public static async setSessionExpiryTimeByUser(
    newExpiryTime: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    sessionUser: User
  ) {
    const sessionToUpdate = await DatabaseConnection.getRepository(
      UserSession
    ).findOne({
      where: {
        sessionOwner: sessionUser,
      },
      relations: {
        sessionOwner: true,
      },
    });
    if (!sessionToUpdate.sessionID) {
      console.log(
        "[LOG-DATA] - " +
          new Date() +
          " -> LOG::Info::SessionRepository::setSessionExpiryTimeByUser::sessionToUpdate::Could not find session for user with ID: " +
          sessionUser.userID
      );
      return null;
    }
    sessionToUpdate.expiresAt = newExpiryTime;
    await DatabaseConnection.getRepository(UserSession)
      .save(sessionToUpdate)
      .then(() => {
        console.log(
          "[LOG-DATA] - " +
            new Date() +
            " -> LOG::Info::SessionRepository::setSessionExpiryTimeByUser::Session with ID: " +
            sessionToUpdate.sessionID +
            " lifespan was set to new expiry time and date: " +
            sessionToUpdate.expiresAt +
            " for user with ID: " +
            sessionUser.userID
        );
      }).catch((error) => { 
        console.log("[LOG-DATA] - " + new Date() + " -> LOG::Error::SessionRepository::setSessionExpiryTimeByUser::Error updating session expiry time, UPDATE operation on session with ID: " + sessionToUpdate.sessionID + " " )
      });
  }
}
