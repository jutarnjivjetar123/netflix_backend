import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import UserSession from "../../models/user.model/session.model";
import { DatabaseConnection } from "../../database/config.database";
import EncryptionHelpers from "../../helpers/encryption.helper";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import UserPublicId from "../../models/user.model/publicId.model";

export default class UserRepository {
  public static async doesUserExistWithEmail(email: string): Promise<boolean> {
    const foundUser = await DatabaseConnection.getRepository(UserEmail).findOne(
      {
        where: {
          email: email,
        },
        relations: {
          user: true,
        },
      }
    );
    return foundUser !== null;
  }

  public static async doesUserExistWithPhoneNumber(
    phoneNumber: string,
    countryCode: string
  ) {
    const foundUser = await DatabaseConnection.getRepository(
      UserPhoneNumber
    ).findOne({
      where: {
        phoneNumber: phoneNumber,
        internationalCallingCode: countryCode,
      },
    });

    return foundUser !== null ? true : false;
  }
  //Function to create new User entity, along with that creates UserEmail, UserPassword, UserSalt objects that have a one to one relationship with the created User entity, relation is connected using userID
  public static async createNewUser(
    username: string,
    firstName: string,
    lastName: string
  ) {
    const newUser = new User();
    newUser.username = username;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.usedEmailToSignUp = true;
    newUser.createdAt = new Date();
    const createdUser = await DatabaseConnection.getRepository(User)
      .save(newUser)
      .then((result) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Success::UserRepository::createNewUserWithEmail::New user with user ID: " +
            result.userID +
            " was successfully created"
        );
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Error::UserRepository::createNewUserWithEmail::Could not create new user, erorr: " +
            error.message
        );
        return null;
      });
    if (!createdUser) {
      return null;
    }

    return newUser;
  }
  public static async createEmailByUser(user: User, newEmail: string) {
    const email = new UserEmail();
    email.email = newEmail;
    email.createdAt = new Date();
    email.user = user;
    return await DatabaseConnection.getRepository(UserEmail)
      .save(email)
      .then((result) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Success::UserRepository::createEmailByUser::New email was created for user with id: " +
            user.userID +
            ", new email object: " +
            JSON.stringify(email)
        );
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            "- LOG::Error::UserRepository::createEmailByUser::Failed to create a new email for user with id: " +
            user.userID +
            ", error: " +
            error.message
        );
        return null;
      });
  }

  public static async createPhoneNumberByUser(
    user: User,
    newPhoneNumber: string,
    countryCode: string
  ) {
    const phoneNumber = new UserPhoneNumber();
    phoneNumber.phoneNumber = newPhoneNumber;
    phoneNumber.internationalCallingCode = countryCode;
    phoneNumber.user = user;
    phoneNumber.createdAt = new Date();
    return await DatabaseConnection.getRepository(UserPhoneNumber)
      .save(phoneNumber)
      .then((result) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Success::UserRepository::createPhoneNumberByUser::New phone number was created for user with id: " +
            user.userID +
            ", new phone number object: " +
            JSON.stringify(phoneNumber)
        );
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            "- LOG::Error::UserRepository::createPhoneNumberByUser::Failed to create a new phone number for user with id: " +
            user.userID +
            ", error: " +
            error.message
        );
        return null;
      });
  }
  public static async createPasswordByUser(user: User, newPassword: string) {
    const password = new UserPassword();
    password.hash = await EncryptionHelpers.hashPassword(newPassword);
    password.salt = await EncryptionHelpers.generateSalt();
    password.createdAt = new Date();
    password.user = user;
    return await DatabaseConnection.getRepository(UserPassword)
      .save(password)
      .then((result) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Success::UserRepository::createPasswordByUser::New password was created for user with id: " +
            user.userID +
            ", new password object: " +
            JSON.stringify(password)
        );
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            "- LOG::Error::UserRepository::createPasswordByUser::Failed to create a new password for user with id: " +
            user.userID +
            ", error: " +
            error.message
        );
        return null;
      });
  }

  public static async createSaltByUser(user: User) {
    const salt = new UserSalt();
    salt.salt = await EncryptionHelpers.generateSalt();
    salt.saltOwner = user;
    salt.createdAt = new Date();
    return await DatabaseConnection.getRepository(UserSalt)
      .save(salt)
      .then((result) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Success::UserRepository::createSaltByUser::New salt was created for user with id: " +
            user.userID +
            ", new salt object: " +
            JSON.stringify(salt)
        );
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            "- LOG::Error::UserRepository::createSaltByUser::Failed to create a new salt for user with id: " +
            user.userID +
            ", error: " +
            error.message
        );
        return null;
      });
  }
  //Creates a public id for specified user, so that id can be used to communicate with outside service, without exposing user data
  public static async createPublicIdForUser(user: User) {
    const publicId = new UserPublicId();
    publicId.user = user;
    publicId.createdAt = new Date();
    publicId.modifiedAt = null;
    return await DatabaseConnection.getRepository(UserPublicId)
      .save(publicId)
      .then((data) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Success::UserRepository::CreatePublicIdForUser::trycatch block::Created public id for user with id: " +
            user.userID
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Error::UserRepository::createPublicIdForUser::trycatch::Error creating new public id for user with id: " +
            user.userID +
            ", error: " +
            error.message
        );
        return null;
      });
  }
  //GET salt value from UserSalt table using userID by email, only returns salt, not complete salt object
  public static async getSaltAndSessionObjectBySessionID(sessionID: string) {
    const searchResult = await DatabaseConnection.getRepository(UserSession)
      .createQueryBuilder("session")
      .innerJoinAndSelect(
        UserSalt,
        "salt",
        "session.sessionOwnerUserID = salt.saltOwnerUserID"
      )
      .where("session.sessionID = :sessionID", { sessionID })
      .getRawOne()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::Error::UserRepository::getSaltAndSessionObjectBySessionID::Error occurred while trying to find session and salt with sessionID: " +
            sessionID +
            ", error: " +
            error.message
        );
        return null;
      });
    console.log(searchResult);
    if (!searchResult) {
      return null;
    }
    const session = new UserSession();
    const salt = new UserSalt();
    for (const key in searchResult) {
      if (key.startsWith("session_")) {
        const attribute = key.replace("session_", "");
        console.log(attribute);
        session[attribute] = searchResult[key];
      }
      if (key.startsWith("salt_")) {
        const attribute = key.replace("salt_", "");
        console.log(attribute);
        salt[attribute] = searchResult[key];
      }
    }
    return { session, salt };
  }
}
