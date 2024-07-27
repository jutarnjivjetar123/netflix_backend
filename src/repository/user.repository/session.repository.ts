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
import JWTHelper from "../../helpers/jwtokens.helpers";

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
}
