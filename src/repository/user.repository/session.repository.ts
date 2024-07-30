import { v4 as uuidv4 } from "uuid";

import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/salt.model";
import UserSession from "../../models/user.model/session.model";
import { MoreThan } from "typeorm";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import UserRepository from "./user.repository";
import EncryptionHelpers from "../../helpers/encryption.helper";
import UserService from "../../service/user.service/user.service";
import JWTHelper from "../../helpers/jwtokens.helpers";
import UserEmail from "../../models/user.model/email.model";

const refreshTokenSecret =
  "1UdngmYkyN8pUPtKTePB/FySbCSf+L9BNmUoE1taBo7N5bErKt1clnN4sxDOWLitIQkaO398jd9LrHSigaKaB3NGc7CoB8UZNuX4GHwnDHRUHt8cEPnQi6AoDaELXnLtgMC/fghYkyeauIRp0mIIgWMpYvVVy89SdnDbQN0x/9psTpa0tAbm6cLnJT9lnq7dEUOcfeDH9cpTRMM9SgMUrKQAYgvDa9NJk2tjX6wGWBb1JqAHHIP7sg/FHXBcxZh0lnaubhxg9iVPWX6vtj4aoIM57KvlmFXbNnpijewkc/VS2k3ozjPjrbl4ycdhPMZNK3mCkTJ4eYAXXgFCHRFM5Q==";
export default class SessionRepository {
  public static async createSession(
    userToCreateSessionFor: User,
    expiresIn: Date = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
  ) {
    const newSession = new UserSession();
    newSession.sessionOwner = userToCreateSessionFor;
    newSession.expiresAt = expiresIn;
    newSession.refreshToken = JWTHelper.generateToken(
      {
        userID: userToCreateSessionFor.userID,
      },
      refreshTokenSecret,
      "30d"
    );
    const isSessionCreated = await DatabaseConnection.getRepository(UserSession)
      .save(newSession)
      .then(() => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Success::SessionRepository::createSession::DatabaseConnection.save(newSession)::New session created successfully for user wiht ID: " +
            userToCreateSessionFor.userID
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Error::SessionRepository::createSession::DatabaseConnection.save(newSession)::Failed to create session for user with ID: " +
            userToCreateSessionFor.userID +
            ", error: " +
            error.message
        );
        return false;
      });

    if (!isSessionCreated) {
      return null;
    }
    return newSession;
  }

  public static async getRefreshToken(user: User) {
    const session = await DatabaseConnection.getRepository(UserSession).findOne(
      {
        where: {
          sessionOwner: user,
        },
        relations: {
          sessionOwner: true,
        },
      }
    );
    return session.refreshToken;
  }
  public static updateRefreshTokenByUserID(userID: string, userSalt: string) {
    const newRefreshToken = JWTHelper.generateToken(
      {
        userID,
      },
      userSalt,
      "30d"
    );
    const session = DatabaseConnection.getRepository(UserSession)
      .createQueryBuilder("session")
      .update(UserSession)
      .set({
        refreshToken: newRefreshToken,
      })
      .where("session.userID = :userID", { userID });
    return newRefreshToken;
  }
  public static async deleteSession(session) {
    return await DatabaseConnection.getRepository(UserSession)
      .remove(session)
      .then(() => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Success::SessionRepository::deleteSession::DatabaseConnection.getRepository(UserSession).remove(session)::Session was successfully deleted"
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Error::SessionRepository::deleteSession::DatabaseConnection.getRepository(UserSession).remove(session)::Could not delete session, error: " +
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

  public static async getLoginDataForUserByUserID(userId: string) {
    const searchResult = await DatabaseConnection.getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect(UserEmail, "email", "user.userID = email.userUserID")
      .innerJoinAndSelect(
        UserSession,
        "session",
        "user.userID = session.sessionOwnerUserID"
      )
      .innerJoinAndSelect(
        UserSalt,
        "salt",
        "user.userID = salt.saltOwnerUserID"
      )
      .getRawMany();
    searchResult.forEach((result) => {
      if (
        !result.hasOwnProperty("user_userID") ||
        !result.user_userID === null
      ) {
        return null;
      }
      if (
        !result.hasOwnProperty("session_sessionID") ||
        !result.session_sessionID === null ||
        result.session_expiresAt < new Date()
      ) {
        return null;
      }
    });
    console.log(searchResult);
    const returnValues = [];
    searchResult.forEach((result) => {
      const user = new User();
      user.userID = result.user_userID;
      user.firstName = result.user_firstName;
      user.lastName = result.user_lastName;
      user.username = result.user_username;
      user.usedEmailToSignUp = result.user_userEmailToSignUp;
      user.createdAt = result.user_createdAt;
      user.modifiedAt = result.user_modifiedAt;
      returnValues.push(user);

      const email = new UserEmail();
      email.emailID = result.email_emailID;
      email.email = result.email_email;
      email.createdAt = result.email_createdAt;
      email.modifiedAt = result.email_modifiedAt;
      returnValues.push(email);

      const session = new UserSession();
      session.sessionID = result.session_sessionID;
      session.createdAt = result.session_createdAt;
      session.expiresAt = result.session_expiresAt;
      session.refreshToken = result.session_refreshToken;
      returnValues.push(session);

      const salt = new UserSalt();
      salt.saltID = result.salt_saltID;
      salt.salt = result.salt_salt;
      salt.saltOwner = result.salt_saltOwnerUserID;
      salt.createdAt = result.salt_createdAt;
      salt.updatedAt = result.salt_updatedAt;
      salt.deletedAt = result.salt_deletedAt;
      returnValues.push(salt);
    });

    console.log(returnValues);
    return returnValues;
  }
}
