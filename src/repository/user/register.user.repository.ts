/*
Class is meant only to be used as communication between database and the server (backend), it is not supposed to contain any error checking, data validation, data manipulation, only contains methods that based on the input parameters and intended use of the method, query the database and return adequate result or return null values if no data was found matching input parameters of the given method

*/
import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
import UserPassword from "../../models/user.model/password.model";
import UserPublicId from "../../models/user.model/publicId.model";
import UserSalt from "../../models/user.model/salt.model";
import EncryptionHelpers from "../../helpers/encryption.helper";
/* METHODS*/
/*
    - Check does User with given email exist
    - Check does User with given phone number exist 
*/
export default class UserRegisterRepository {
  public static async checkDoesUserExistWithEmail(email: string) {
    const result = await DatabaseConnection.getRepository(UserEmail)
      .findOne({
        where: {
          email: email,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::ERROR::Repository::User::Register::checkDoesUserExistWithEmail::Error occurred while trying to find user with email: " +
            email +
            ", error message: " +
            error.message
        );
        return null;
      });

    if (!result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " - LOG::Info::Repository::User::Register::checkDoesUserExistWithEmail::No user was found with email: " +
          email
      );
    }
    return result !== null;
  }
  public static async checkDoesUserExistWithPhoneNumber(
    countryCode: string,
    phoneNumber: string
  ) {
    const result = await DatabaseConnection.getRepository(UserPhoneNumber)
      .findOne({
        where: {
          countryCode: countryCode,
          phoneNumber: phoneNumber,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::ERROR::Repository::User::Register::checkDoesUserExistWithPhoneNumber::Error occurred while trying to find user with phone number: " +
            `${countryCode}${phoneNumber}` +
            ", error message: " +
            error.message
        );
        return null;
      });

    if (!result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " - LOG::Info::Repository::User::Register::checkDoesUserExistWithPhoneNumber::No user was found with phone number: " +
          `${countryCode}${phoneNumber}`
      );
    }
    return result !== null;
  }

  public static async createUserObject(wasEmailUsedToSignUp: boolean) {
    const newUser = new User();
    newUser.createdAt = new Date().getTime().toString();
    newUser.usedEmailToSignUp = wasEmailUsedToSignUp;
    const user: User | null = await DatabaseConnection.getRepository(User)
      .save(newUser)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::ERROR::Repository::User::Register::createUserObject::Failed to create a new User class instance, error message: " +
            error.message
        );
        return null;
      });

    if (user) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::User::Register::createUserObject::Created new User object with Id: " +
          user.userId
      );
    }

    return user;
  }

  public static async createUserEmailObject(
    userToCreateFor: User,
    email: string
  ) {
    const newEmail = new UserEmail();
    newEmail.user = userToCreateFor;
    newEmail.email = email;
    newEmail.createdAt = new Date().getTime().toString();
    const result = await DatabaseConnection.getRepository(UserEmail)
      .save(newEmail)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::ERROR::Repository::User::Register::createUserEmailObject::Error occurred while trying to create an UserEmail object with email " +
            email +
            " and for user with userId: " +
            userToCreateFor.userId +
            ", error message: " +
            error.message
        );
        return null;
      });

    if (result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::User::Register::createUserEmailObject::Successfully create a new UserEmail object with following values: \nuserId: " +
          newEmail.user.userId +
          "\nemail: " +
          newEmail.email +
          "\nemailId: " +
          newEmail.userEmailId
      );
    }
    return result;
  }

  public static async createUserPhoneNumber(
    userToCreateFor: User,
    countryCode: string,
    phoneNumber: string
  ) {
    const newPhoneNumber = new UserPhoneNumber();
    newPhoneNumber.user = userToCreateFor;
    newPhoneNumber.countryCode = countryCode;
    newPhoneNumber.phoneNumber = phoneNumber;
    newPhoneNumber.createdAt = new Date().getTime().toString();

    const result: UserPhoneNumber | null =
      await DatabaseConnection.getRepository(UserPhoneNumber)
        .save(newPhoneNumber)
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.log(
            "[LOG DATA] - " +
              new Date() +
              " -> LOG::Repository::User::Register::createUserPhoneNumber::Error occurred while trying to save new phone number " +
              `${countryCode}${phoneNumber}` +
              " for user with id: " +
              userToCreateFor.userId +
              ", error message: " +
              error.message
          );
          return null;
        });
    if (result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          ` -> LOG::Info::Repository::User::Register::Successfully create a new UserPhoneNumber object with following values: \nuserId: ${result.user.userId}\ncountryCode: ${result.countryCode}\nphoneNumber: ${result.phoneNumber}`
      );
    }
    return result;
  }
  public static async createUserPasswordObject(
    userToCreateFor: User,
    hash: string,
    salt: string
  ) {
    const newPassword = new UserPassword();
    newPassword.user = userToCreateFor;
    newPassword.hash = hash;
    newPassword.salt = salt;
    newPassword.createdAt = new Date().getTime().toString();
    const result = await DatabaseConnection.getRepository(UserPassword)
      .save(newPassword)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Register::createUserPasswordObject::Failed to create a new UserPassword object for user with id: " +
            userToCreateFor.userId
        );

        return null;
      });
    if (result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::User::Register::createUserPasswordObject::Successfully created new UserPassword object for user with Id: " +
          newPassword.user.userId
      );
    }
    return newPassword;
  }

  public static async createUserPublicId(
    userToCreateFor: User
  ): Promise<UserPublicId> {
    const newPublicUserId = new UserPublicId();
    newPublicUserId.user = userToCreateFor;
    newPublicUserId.createdAt = new Date().getTime().toString();
    const result = await DatabaseConnection.getRepository(UserPublicId)
      .save(newPublicUserId)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::ERROR::Repository::Register::User::createUserPublicId::Error occurred whilst trying to save a instance of public id for user with id: " +
            userToCreateFor.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
    if (result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::User::Register::createUserPublicId::Created new public id for user with id: " +
          userToCreateFor.userId
      );
    }
    return result;
  }

  public static async createUserSalt(user: User) {
    const newSalt = new UserSalt();
    newSalt.user = user;
    newSalt.salt = await EncryptionHelpers.generateSalt();
    newSalt.createdAt = new Date().getTime().toString();
    newSalt.modifiedAt = null;
    const result = await DatabaseConnection.getRepository(UserSalt)
      .save(newSalt)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Register::createUserSalt::Created new UserSalt for User with id: " +
            newSalt.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Register::createUserSalt::Error occurred while creating a new UserSalt object for User with Id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });

    return result;
  }
}
