import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserPublicId from "../../models/user.model/publicId.model";
import UserSession from "../../models/user.model/session.model";
import UserSalt from "../../models/user.model/salt.model";
import JWTHelper from "../../helpers/jwtokens.helpers";
import EncryptionHelpers from "../../helpers/encryption.helper";
import Subscription from "../../models/subscription.model/subscription.model";
import ConfirmationCode from "../../models/user.model/confirmationCode.model";

export default class UserLoginRepository {
  /*
  Function to retrieve from database data from tables:
  - User
  - UserEmail
  - UserPassword
  - UserSalt
  - UserSession
  - UserPublicId
  by the provided email value in parameter email, if no corresponding email value was provided, then returns null. If corresponding values are found then an array of objects is returned
  */
  public static async getLoginDataByEmail(email: string) {
    const retrievedObjects = await DatabaseConnection.getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect(UserEmail, "email", "user.userId = email.userId")
      .innerJoinAndSelect(
        UserPassword,
        "password",
        "user.userId = password.userId"
      )
      .innerJoinAndSelect(UserSalt, "salt", "user.userId = salt.userId")
      .innerJoinAndSelect(
        UserPublicId,
        "publicId",
        "user.userId = publicId.userId"
      )
      .leftJoinAndSelect(UserSession, "session", "user.userId = session.userId")
      .innerJoinAndSelect(
        Subscription,
        "subscription",
        "user.userId = subscription.userId"
      )
      .leftJoinAndSelect(
        ConfirmationCode,
        "confirmationCode",
        "user.userId = confirmationCode.userId"
      )
      .where("email.email = :emailParameter", { emailParameter: email })
      .getRawOne()
      .then((data) => {
        if (!data) {
          console.log(
            "[LOG DATA] - " +
              new Date() +
              " -> LOG::Info::Repository::User::Login::getLoginDataByEmail::No data was found for email: " +
              email
          );
          return null;
        }

        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Login::getLoginDataByEmail::Found requested data for email: " +
            email +
            ", data without entity sorting: "
        );
        console.log(data);

        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Login::getLoginDataByEmail::Failed to retrieve data for email: " +
            email +
            ", error message: " +
            error.message
        );
        return null;
      });

    if (!retrievedObjects) {
      return null;
    }

    const assignValues = (result: any, object: any, prefix: string) => {
      Object.keys(result).forEach((key) => {
        if (key.startsWith(prefix)) {
          const attribute = key.replace(`${prefix}_`, "");
          object[attribute] = result[key];
        }
      });
    };

    const user = new User();
    const userEmail = new UserEmail();
    const password = new UserPassword();
    const salt = new UserSalt();
    const session = new UserSession();
    const publicId = new UserPublicId();
    const subscription = new Subscription();
    const confirmationCode = new ConfirmationCode();
    assignValues(retrievedObjects, user, "user");
    assignValues(retrievedObjects, userEmail, "email");
    assignValues(retrievedObjects, password, "password");
    assignValues(retrievedObjects, salt, "salt");
    assignValues(retrievedObjects, session, "session");
    assignValues(retrievedObjects, publicId, "publicId");
    assignValues(retrievedObjects, subscription, "subscription");
    assignValues(retrievedObjects, confirmationCode, "confirmationCode");
    return {
      user,
      userEmail,
      password,
      salt,
      session,
      publicId,
      subscription,
      confirmationCode
    };
  }

  public static async createSessionByUser(
    user: User,
    publicId: string,
    salt: string
  ) {
    const newSession = new UserSession();
    newSession.user = user;
    newSession.refreshToken = JWTHelper.generateToken(
      {
        publicId: publicId,
      },
      salt,
      "30d"
    );

    newSession.createdAt = new Date().getTime().toString();
    newSession.expiresAt = new Date()
      .setMonth(new Date().getMonth() + 1)
      .toString();
    return await DatabaseConnection.getRepository(UserSession)
      .save(newSession)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Login::createSessionByUser::Created new UserSession object for User with userId: " +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Login::Failed to create new UserSession object for User with userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function which removes the given UserSession object from the database, takes in UserSession parameter, and does not check does the given UserSession exist in the database
  public static async deleteUserSession(sessionToDelete: UserSession) {
    return await DatabaseConnection.getRepository(UserSession)
      .remove(sessionToDelete)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Login::Successfully deleted UserSession object for the following User with userId: " +
            sessionToDelete.user.userId
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Login::Failed to delete UserSession object for the following User with userId: " +
            sessionToDelete.user.userId +
            ", error message: " +
            error.message
        );
        return false;
      });
  }

  /* 
  Function to update given UserSession object with given parameters,
  Properties available to update:
  refreshToken: string,
  expiresAt: string,
  NOTE: Does not check if the values have been changed
  Parameters: 
  **Required:
  - session: UserSession, UserSession object which will be updated
  - user: User, User object to whom the UserSession object has a one to one relation
  **Optional:
  - refreshToken: string,
  - expiresAt: string,
  NOTE: At least one of the optional parameters must NOT be null
  Returns NULL value if the update was not completed
  Returns updated UserSession object if the update was completed
  */
  public static async updateUserSession(
    session: UserSession,
    user: User,
    refreshToken: string = null,
    expiresAt: string = null
  ) {
    //At least one of the optional parameters must be provided for the update to be successful
    if (!refreshToken && !expiresAt) {
      return null;
    }
    if (expiresAt !== null) {
      session.expiresAt = expiresAt;
    }
    if (refreshToken !== null) {
      session.refreshToken = refreshToken;
    }
    return await DatabaseConnection.getRepository(UserSession)
      .save(session)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Login::Updated UserSession object for user with userId: " +
            user.userId +
            ", updated object: "
        );
        console.log(session);
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Login::Failed to update UserSession object for User object with userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function to check does the provided User object have a relation with UserSession
  public static async checkForUserSessionByUser(user: User): Promise<boolean> {
    const result = await DatabaseConnection.getRepository(UserSession).count({
      where: {
        user: user,
      },
      relations: {
        user: true,
      },
    });
    console.log(result);
    return result > 0;
  }

  //Function to retrieve UserSession object based on the provided User object with whom the object has an existing one to one relation
  /*
  Parameters: 
  - user: User, User object which will be used to search the database for the related UserSession object
  Returns null if no UserSession object related to the provided User object was NOT found
  Returns UserSession object with user parameter containing the User relation object if found
  */
  public static async getUserSessionByUser(user: User) {
    return await DatabaseConnection.getRepository(UserSession)
      .findOne({
        where: {
          user: user,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Login::getUserSessionByUser::Found UserSession object for User object with userId: " +
            data.user.userId +
            ", found UserSession object structure and corresponding data:"
        );
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Login::getUserSessionByUser::Failed to retrieve UserSession object for the provided User with userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }
}
