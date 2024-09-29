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
import ConfirmationCode from "../../models/user.model/confirmationCode.model";
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

  public static async getUserEmailByUser(
    user: User
  ): Promise<UserEmail | null> {
    return await DatabaseConnection.getRepository(UserEmail)
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
            " -> LOG::Info::Repository::User::Register::getUserEmailByUser::Found UserEmail for User object with id" +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Register::getUserEmailByUser::Error occurred while trying to find UserEmail for User with id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function to get ConfirmationCode related to the given User with userId
  public static async getConfirmationCodeByUser(
    user: User
  ): Promise<ConfirmationCode | null> {
    return await DatabaseConnection.getRepository(ConfirmationCode)
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
            " -> LOG::Info::Repository::Register::User::ConfirmationCode::getConfirmationCodeByUser::Found ConfirmationCode for User object with userId: " +
            data.user.userId +
            ", ConfirmationCode object data: \n" +
            data
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Register::User::ConfirmationCode::getConfirmationCodeByUser::Could not find ConfirmationCode by User with userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function for creating new ConfirmationCode for the given User
  public static async createConfirmationCodeByUser(
    user: User
  ): Promise<ConfirmationCode | null> {
    const newConfirmationCode = new ConfirmationCode();
    newConfirmationCode.user = user;
    newConfirmationCode.confirmationCode = Math.floor(
      Math.random() * 900000 + 100000
    ).toString();
    newConfirmationCode.createdAt = new Date().getTime().toString();
    newConfirmationCode.isSent = false;
    newConfirmationCode.isConfirmed = false;
    newConfirmationCode.modifiedAt = null;

    //Attempt to save the before created ConfirmationCode object
    return await DatabaseConnection.getRepository(ConfirmationCode)
      .save(newConfirmationCode)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Register::ConfirmationCode::Saved new ConfirmationCode for User with userId: " +
            data.user.userId +
            ", created ConfirmationCode object: \n" +
            data
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Register::ConfirmationCode::Could not save new ConfirmationCode for the User object with userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function to attempt to update ConfirmationCode with given User object
  public static async updateConfirmationCodeByUser(
    user: User,
    newConfirmationCode: string = null,
    newIsConfirmed: boolean = null,
    newIsSent: boolean = null
  ): Promise<ConfirmationCode | null> {
    //Get ConfirmationCode from database related to the given User object
    const confirmationCode = await this.getConfirmationCodeByUser(user);
    if (!confirmationCode) {
      return null;
    }

    let isConfirmationCodeSet = false;
    let isIsSentSet = false;
    let isIsConfirmedSet = false;
    //Check is confirmationCode field updated, if it is set the ConfirmationCode object confirmationCode to the new value
    if (newConfirmationCode) {
      if (newConfirmationCode !== confirmationCode.confirmationCode) {
        isConfirmationCodeSet = true;
        confirmationCode.confirmationCode = newConfirmationCode;
      }
    }
    //Check is isSent field updated, if it is set the ConfirmationCode object isSent to the new value
    if (newIsSent) {
      if (newIsSent !== confirmationCode.isSent) {
        isIsSentSet = true;
        confirmationCode.isSent = newIsSent;
      }
    }
    //Check is isConfirmed field updated, if it is set the ConfirmationCode object isConfirmed to the new value
    if (newIsConfirmed) {
      if (newIsConfirmed !== confirmationCode.isConfirmed) {
        isIsConfirmedSet = true;
        confirmationCode.isConfirmed = newIsConfirmed;
      }
    }

    if (!newIsConfirmed && !newIsSent && !newConfirmationCode) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Error::Repository::User::Register::ConfirmationCode::updateConfirmationCodeByUser::Failed to save new ConfirmationCode for User with userId: " +
          user.userId +
          ", error message: No new values to update was set to update"
      );
      return null;
    }
    confirmationCode.modifiedAt = new Date().getTime().toString();
    //Attempt to update ConfirmationCode with new data
    return await DatabaseConnection.getRepository(ConfirmationCode)
      .save(confirmationCode)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Register::ConfirmationCode::updateConfirmationCodeByUser::Saved updated ConfirmationCode for User with userId: " +
            data.user.userId +
            "\nUpdated data: \n" +
            (isConfirmationCodeSet
              ? "Confirmation code: " + newConfirmationCode
              : "") +
            "\n" +
            (isIsConfirmedSet ? "Is confirmed: " + newIsConfirmed : "") +
            "\n" +
            (isIsSentSet ? "Is sent: " + newIsSent : "")
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Register::ConfirmationCode::updateConfirmationCodeByUser::Failed to update ConfirmationCode object with new data for User object with userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function to delete ConfirmationCode object related to the given User, ConfirmationCode to delete must be provided in the parameter
  public static async deleteConfirmationCodeByUser(
    user: User
  ): Promise<boolean> {
    //Get ConfirmationCode by User
    const confirmationCode = await this.getConfirmationCodeByUser(user);
    if (!confirmationCode) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Error::Repository::User::Register::ConfirmationCode::deleteConfirmationCodeByUser::Failed to delete ConfirmationCode object for User object with userId: " +
          user.userId +
          ", error message: User does not have relation with ConfirmationCode"
      );
      return false;
    }

    //Attempt to delete and get result of the operation (true if successful and false if it fails)
    return await DatabaseConnection.getRepository(ConfirmationCode)
      .remove(confirmationCode)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::Register::ConfirmationCode::deleteConfirmationCodeByUser::Successfully deleted ConfirmationCode object related to the given User object with userId: " +
            user.userId
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Register::ConfirmationCode::deleteConfirmationCodeByUser::Failed to delete ConfirmationCode related to the User object with userId: " +
            user.userId +
            ", error message: " +
            error
        );
        return false;
      });
  }
}
