import { v4 as uuidv4 } from "uuid";

import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/session.model";
import UserSession from "../../models/user.model/session.model";
import { MoreThan } from "typeorm";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import UserRepository from "./user.repository";
import EncryptionHelpers from "../../helpers/encryption.helper";
import UserService from "../../service/user.service/user.service";

export default class SessionRepository {
  public static async createSession(
    userToCreateSessionFor: User,
    ttl: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    initialIPAddress: string,
    userAgent: string
  ) {
    const newSession = new UserSession();
    newSession.sessionOwner = userToCreateSessionFor;
    newSession.lastActivityAt = new Date();
    newSession.expiresAt = ttl;
    newSession.ipAddressOfSessionInitialization = initialIPAddress;
    newSession.lastIpAddressOfActivity = initialIPAddress;
    newSession.userAgent = userAgent;
    newSession.verificationToken = uuidv4();
    const isSessionCreated = await DatabaseConnection.getRepository(UserSession)
      .save(newSession)
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::ERROR::SessionRepository::createSession::DatabaseConnection.save(newSession)::Failed to create new session, error message: " +
            error.message
        );
        return null;
      });
    if (!isSessionCreated) {
      return null;
    }
    console.log(
      "[LOG - DATA] - " +
        new Date() +
        " - LOG::SUCCESS::SessionRepository::createSession::isSessionCreated::New session for user with ID: " +
        userToCreateSessionFor.userID +
        " was SUCCESSFULLY created with new session ID: " +
        newSession.sessionID
    );
    return newSession;
  }
  public static async deleteSession(sessionToDelete: UserSession) {
    return await DatabaseConnection.getRepository(UserSession)
      .remove(sessionToDelete)
      .then(() => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::SUCCESS::SessionRepository::deleteSession::DatabaseConnection.remove(sessionToDelete)::Session was successfully deleted from the database"
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::ERROR::SessionRepository::deleteSession::DatabaseConnection.remove(sessionToDelete)::Error occured whilst deleting session, session wasn't deleted, error message: " +
            error.message
        );
        return false;
      });
  }
  public static async getSessionByUser(user: User) {
    return await DatabaseConnection.getRepository(UserSession).findOne({
      where: {
        sessionOwner: user,
      },
      relations: {
        sessionOwner: true,
      },
    });
  }

  public static async refreshAuthenticationToken(tokenInSession: UserSession) {
    const userSalt = await UserService.getUserSaltByUser(
      tokenInSession.sessionOwner
    );
    const newToken = await EncryptionHelpers.hashPassword(userSalt.salt);
    tokenInSession.authToken = newToken;
    tokenInSession.lastActivityAt = new Date();
    const updateSession = await DatabaseConnection.getRepository(UserSession)
      .save(tokenInSession)
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::ERROR::SessionRepository::refreshAuthenticationToken::DatabaseConnection.save(tokenInSession)::Error occurred whilst updating session authentication token, session wasn't updated, error message: " +
            error.message
        );
        return null;
      });
    if (!updateSession) {
      return null;
    }
    console.log(
      "[LOG - DATA] - " +
        new Date() +
        " - LOG::ERROR::SessionRepository::refreshAuthenticationToken::updateSession::Session " +
        tokenInSession.sessionID +
        " token was refreshed successfully"
    );
    return tokenInSession;
  }
}
