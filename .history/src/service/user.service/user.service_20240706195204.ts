import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
import DataSanitation from "../../helpers/sanitation.helpers";
import UserRepository from "../../repository/user.repository/user.repository";

import ReturnObjectHandler from "../../utilities/returnObject.utility";
import EncryptionHelpers from "../../helpers/encryption.helper";
import validator from "validator";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import { parse } from "path";
export default class UserService {
  public static async checkDoesUserExistWithEmail(
    email: string
  ): Promise<ReturnObjectHandler<boolean>> {
    if (!validator.isEmail(email)) {
      return new ReturnObjectHandler(
        "Provided email cannot be considered valid email address",
        false
      );
    }
    email = DataSanitation.sanitizeEmail(email);
    const databaseSearchResult = await UserRepository.getUserByEmail(email);
    if (databaseSearchResult) {
      return new ReturnObjectHandler("Email " + email + " taken", true);
    }

    return new ReturnObjectHandler("Email not used", false);
  }

  public static async checkDoesUserExistWithPhoneNumber(
    phoneNumber: string
  ): Promise<ReturnObjectHandler<boolean>> {
    if (!validator.isMobilePhone(phoneNumber)) {
      return new ReturnObjectHandler(
        "Provided phone number cannot be considered valid",
        null
      );
    }
    const databaseSearchResult = await UserRepository.getUserByPhoneNumber(phoneNumber);
    if(databaseSearchResult)

  }
  private static async createNewUserObjectByEmail(
    firstName: string,
    lastName: string,
    username: string
  ) {
    const userCreationResult =
      await UserRepository.createNewUser_DefaultForEmailCreation(
        firstName,
        lastName,
        username
      );

    if (!userCreationResult) {
      return new ReturnObjectHandler("Could not create new user", null);
    }

    return new ReturnObjectHandler<User>(
      "User created successfully with the following data: " +
        JSON.stringify({
          username: userCreationResult.returnValue.username,
          firstName: userCreationResult.returnValue.firstName,
          lastName: userCreationResult.returnValue.lastName,
          usedEmailToSignUp: userCreationResult.returnValue.userEmailToSignUp,
        }),
      userCreationResult.returnValue
    );
  }

  private static async createNewUserEmailObject(
    email: string,
    userSigningUp: User
  ) {
    const newEmail = await UserRepository.createNewUserEmail(
      email,
      userSigningUp
    );

    if (!newEmail) {
      return new ReturnObjectHandler(
        "Could not create new email with value: " +
          email +
          " for user wiht id: " +
          userSigningUp.userID,
        null
      );
    }

    return new ReturnObjectHandler(
      "Created new email " +
        newEmail.email +
        " for user with ID: " +
        userSigningUp.userID,
      newEmail
    );
  }

  private static async createNewUserPhoneObject(
    phoneNumber: string,
    userToCreatePhoneNumberFor: User,
    countryCode: string = null,
    region: string = null
  ) {
    const createdPhoneNumber: ReturnObjectHandler<UserPhoneNumber | null> =
      await UserRepository.createNewUserPhoneNumber(
        phoneNumber,
        userToCreatePhoneNumberFor,
        countryCode
      );

    return createdPhoneNumber;
  }

  private static async createNewPasswordObjectForUser(
    password: string,
    userToCreatePasswordFor: User
  ) {
    const passwordHash = await EncryptionHelpers.hashPassword(password);
    const newPassword = await UserRepository.createUserPassword(
      passwordHash,
      userToCreatePasswordFor
    );
    if (!newPassword) {
      return new ReturnObjectHandler(
        "Could not create new password for user with ID: " +
          userToCreatePasswordFor.userID,
        null
      );
    }

    return new ReturnObjectHandler(
      "Created new password for user with ID: " +
        userToCreatePasswordFor.userID,
      newPassword
    );
  }

  private static async createNewUserSaltObjectForUser(createSaltForUser: User) {
    const newUserSalt = await UserRepository.createNewUserSalt(
      createSaltForUser
    );
    if (!newUserSalt) {
      return new ReturnObjectHandler(
        "Could not create new salt for user with ID: " +
          createSaltForUser.userID,
        null
      );
    }
    return new ReturnObjectHandler(
      "Created new salt for user with ID: " + createSaltForUser.userID,
      newUserSalt
    );
  }

  private static async createUserObjectByPhoneNumber(
    firstName: string = null,
    lastName: string = null,
    username: string = null
  ) {
    const userCreationResult =
      await UserRepository.createNewUser_DefaultForEmailCreation(
        firstName,
        lastName,
        username,
        false
      );
    if (!userCreationResult.returnValue) {
      return new ReturnObjectHandler("Could not create new user", null);
    }
    return new ReturnObjectHandler<User>(
      "User created successfully with the following data: " +
        JSON.stringify({
          username: userCreationResult.returnValue.username,
          firstName: userCreationResult.returnValue.firstName,
          lastName: userCreationResult.returnValue.lastName,
          usedEmailToSignUp: userCreationResult.returnValue.userEmailToSignUp,
        }),
      userCreationResult.returnValue
    );
  }
  public static async createNewUserByEmail(
    firstName: string = null,
    lastName: string = null,
    username: string = null,
    email: string,
    password: string
  ): Promise<ReturnObjectHandler<any>> {
    if (!email) {
      return new ReturnObjectHandler("Email must be provided", null);
    }
    if (!password) {
      return new ReturnObjectHandler("Password must be provided", null);
    }
    if (!validator.isEmail(email)) {
      return new ReturnObjectHandler(
        "Provided email cannot be considered valid email address",
        null
      );
    }
    if (firstName) {
      firstName = DataSanitation.replaceHTMLTagsWithEmptyString(firstName);
      firstName = DataSanitation.removeAllSpecialCharacters(firstName);
      firstName = DataSanitation.removeAllWhitespaces(firstName);
    }

    if (lastName) {
      lastName = DataSanitation.replaceHTMLTagsWithEmptyString(lastName);
      lastName = DataSanitation.removeAllSpecialCharacters(lastName);
      lastName = DataSanitation.removeAllWhitespaces(lastName);
    }

    if (username) {
      username = DataSanitation.replaceHTMLTagsWithEmptyString(username);
      username = DataSanitation.removeAllSpecialCharacters(username);
      username = DataSanitation.removeAllWhitespaces(firstName);
    }

    const userCreationResult = await this.createNewUserObjectByEmail(
      username,
      firstName,
      lastName
    );

    if (!userCreationResult.returnValue) {
      return new ReturnObjectHandler("Could not create new user", null);
    }

    const parsedEmail = DataSanitation.sanitizeEmail(email);

    const createdEmail = await this.createNewUserEmailObject(
      parsedEmail,
      userCreationResult.returnValue
    );
    if (!createdEmail.returnValue) {
      return new ReturnObjectHandler(
        "Could not create email for user with ID: " +
          userCreationResult.returnValue.userID,
        null
      );
    }

    password = DataSanitation.removeAllWhitespaces(password);
    const createdPassword = await this.createNewPasswordObjectForUser(
      password,
      userCreationResult.returnValue
    );

    if (!createdPassword.returnValue) {
      return new ReturnObjectHandler(
        "Could not create new password for user",
        null
      );
    }

    const createdSalt = await this.createNewUserSaltObjectForUser(
      userCreationResult.returnValue
    );
    if (!createdSalt.returnValue) {
      return createdSalt;
    }
    return new ReturnObjectHandler<any>(
      "User created successfully with the following data: " +
        JSON.stringify({
          userID: userCreationResult.returnValue.userID,
          email: createdEmail.returnValue.email,
          passwordID: createdPassword.returnValue.passwordID,
          saltID: createdSalt.returnValue.saltID,
        }),
      {
        userObject: userCreationResult.returnValue,
        emailObject: createdEmail.returnValue,
        passwordObject: createdPassword.returnValue,
        saltObject: createdSalt.returnValue,
      }
    );
  }

  public static async createNewUserByPhoneNumber(
    firstName: string = null,
    lastName: string = null,
    username: string = null,
    phoneNumber: string,
    password: string
  ) {
    if (!phoneNumber) {
      return new ReturnObjectHandler("Phone number must be provided", null);
    }
    if (!password) {
      return new ReturnObjectHandler("Password must be provided", null);
    }
    if (!PhoneNumberHelper.isValidPhoneNumberFromString(phoneNumber)) {
      return new ReturnObjectHandler(
        "Provided phone number cannot be considered a valid phone number",
        null
      );
    }
    const parsedPhoneNumber = PhoneNumberHelper.parsePhoneNumber(phoneNumber);
    if (firstName) {
      firstName = DataSanitation.replaceHTMLTagsWithEmptyString(firstName);
      firstName = DataSanitation.removeAllSpecialCharacters(firstName);
      firstName = DataSanitation.removeAllWhitespaces(firstName);
    }

    if (lastName) {
      lastName = DataSanitation.replaceHTMLTagsWithEmptyString(lastName);
      lastName = DataSanitation.removeAllSpecialCharacters(lastName);
      lastName = DataSanitation.removeAllWhitespaces(lastName);
    }

    if (username) {
      username = DataSanitation.replaceHTMLTagsWithEmptyString(username);
      username = DataSanitation.removeAllSpecialCharacters(username);
      username = DataSanitation.removeAllWhitespaces(firstName);
    }

    const newUser = await this.createUserObjectByPhoneNumber(
      firstName,
      lastName,
      username
    );

    if (!newUser) return new ReturnObjectHandler(newUser.message, null);

    const newPhoneNumber = await this.createNewUserPhoneObject(
      parsedPhoneNumber.phoneNumber,
      newUser.returnValue,
      parsedPhoneNumber.countryCode,
      parsedPhoneNumber.region
    );
    if (!newPhoneNumber.returnValue) {
      return new ReturnObjectHandler(
        "Could not create new phone number for user with ID: " +
          newUser.returnValue.userID +
          ", error: " +
          newPhoneNumber.message,
        null
      );
    }

    const newPassword = await this.createNewPasswordObjectForUser(
      password,
      newUser.returnValue
    );
    if (!newPassword.returnValue)
      return new ReturnObjectHandler(
        "Could not create new password for user",
        null
      );
    const newSalt = await this.createNewUserSaltObjectForUser(
      newUser.returnValue
    );
    if (!newSalt.returnValue)
      return new ReturnObjectHandler(
        "Could not create new salt for user",
        null
      );
    return new ReturnObjectHandler("Created new user using phone number", {
      userObject: newUser.returnValue,
      phoneNumberObject: newPhoneNumber.returnValue,
      passwordObject: newPassword.returnValue,
      saltObject: newSalt.returnValue,
    });
  }
}