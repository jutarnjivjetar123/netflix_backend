import { v4 as uuidv4 } from "uuid";

import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserSalt from "../../models/user.model/salt.model";
import UserSession from "../../models/user.model/session.model";
import UserPassword from "../../models/user.model/password.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
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

  public static async getLoginDataForUserByEmail(email: string): Promise<{
    user: User;
    emailObject: UserEmail;
    password: UserPassword;
    salt: UserSalt;
    session: UserSession;
  } | null> {
    console.log("Getting data for user with email: " + email);
    const result = await DatabaseConnection.getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect(UserEmail, "email", "user.userID = email.userUserID")
      .innerJoinAndSelect(
        UserPassword,
        "password",
        "user.userID = password.userUserID"
      )
      .innerJoinAndSelect(
        UserSalt,
        "salt",
        "user.userID = salt.saltOwnerUserID"
      )
      .leftJoinAndSelect(
        UserSession,
        "session",
        "user.userID = session.sessionOwnerUserID"
      )
      .where("email = :email", { email })
      .getRawOne();

    const user = new User();
    const emailObject = new UserEmail();
    const password = new UserPassword();
    const salt = new UserSalt();
    const session = new UserSession();

    for (const key in result) {
      if (key.startsWith("user_")) {
        const attribute = key.replace("user_", "");
        user[attribute] = result[key];
      }
      if (key.startsWith("email_")) {
        const attribute = key.replace("email_", "");
        emailObject[attribute] = result[key];
      }
      if (key.startsWith("password_")) {
        const attribute = key.replace("password_", "");
        password[attribute] = result[key];
      }
      if (key.startsWith("salt_")) {
        const attribute = key.replace("salt_", "");
        salt[attribute] = result[key];
      }
      if (key.startsWith("session_")) {
        const attribute = key.replace("session_", "");
        session[attribute] = result[key];
      }
    }

    console.log(user);
    console.log(emailObject);
    console.log(password);
    console.log(salt);
    console.log(session);
    return { user, emailObject, password, salt, session };
  }

  public static async getLoginDataForUserByPhoneNumber(
    phoneNumber: string,
    countryCode: string
  ) {
    const searchResult = await DatabaseConnection.getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect(
        UserPhoneNumber,
        "phone",
        "user.userID = phone.userUserID"
      )
      .leftJoinAndSelect(UserEmail, "email", "user.userID = email.userUserID")
      .innerJoinAndSelect(
        UserPassword,
        "password",
        "user.userID = password.userUserID"
      )
      .innerJoinAndSelect(
        UserSalt,
        "salt",
        "user.userID = salt.saltOwnerUserID"
      )
      .leftJoinAndSelect(
        UserSession,
        "session",
        "user.userID = session.sessionOwnerUserID"
      )
      .where("phone.phoneNumber = :phoneNumber", { phoneNumber })
      .andWhere("phone.internationalCallingCode = :countryCode", {
        countryCode,
      })
      .getRawOne();

    console.log(
      "[LOG - DATA] - " +
        new Date() +
        " -> LOG::Info::SessionRepository::getLoginDataForUserByPhoneNumber::Retrieved login data for phone number (" +
        countryCode +
        ") " +
        phoneNumber +
        ": " +
        JSON.stringify(searchResult)
    );

    const user = new User();
    const email = new UserEmail();
    const phone = new UserPhoneNumber();
    const password = new UserPassword();
    const salt = new UserSalt();
    const session = new UserSession();

    for (const key in searchResult) {
      if (key.startsWith("user_")) {
        const attribute = key.replace("user_", "");
        user[attribute] = searchResult[key];
      }
      if (key.startsWith("email_")) {
        const attribute = key.replace("email_", "");
        email[attribute] = searchResult[key];
      }
      if (key.startsWith("phone_")) {
        const attribute = key.replace("phone_", "");
        phone[attribute] = searchResult[key];
      }
      if (key.startsWith("password_")) {
        const attribute = key.replace("password_", "");
        password[attribute] = searchResult[key];
      }
      if (key.startsWith("salt_")) {
        const attribute = key.replace("salt_", "");
        salt[attribute] = searchResult[key];
      }
      if (key.startsWith("session_")) {
        const attribute = key.replace("session_", "");
        session[attribute] = searchResult[key];
      }
    }

    return { user, phone, email, password, salt, session };
  }

  public static async getSessionObjectBySessionId(sessionId: string) {
    return await DatabaseConnection.getRepository(UserSession)
      .findOne({
        where: {
          sessionID: sessionId,
        },
      })
      .then((data) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Success::SessionRepository::getSessionObjectBySessionId::Found session for sessionId: " +
            sessionId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Error::SessionRepository::getSessionObjectBySessionID::Error occured whilst trying to find session with id " +
            sessionId +
            ", error: " +
            error.message
        );
        return null;
      });
  }
}
