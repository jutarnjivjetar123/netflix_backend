import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
import DataSanitation from "../../helpers/sanitation.helpers";
import UserRepository from "../../repository/user.repository/user.repository";

import ReturnObjectHandler from "../../utilities/returnObject.utility";
import EncryptionHelpers from "../../helpers/encryption.helper";
import validator, { isNumeric } from "validator";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import { parse } from "path";
import { PhoneNumber } from "google-libphonenumber";
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

  public static async checkDoesUserExistWithPhoneNumber_WithParsing(
    phoneNumber: string
  ) {
    console.log(
      new Date() +
        " -> LOG::Info::UserService::checkDoesUserExistWithPhoneNumber::parameter phoneNumber has value of: " +
        phoneNumber
    );
    let parsedPhoneNumber;
    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::checkDoesUserExistWithPhoneNumber::parsedPhoneNumber::TryCatch statement::Error exception: " +
          error.message +
          "::Could not parse phone number: " +
          phoneNumber
      );
      return new ReturnObjectHandler(error.message, null);
    }

    const nationalPhoneNumber =
      typeof parsedPhoneNumber === "string"
        ? parsedPhoneNumber
        : parsedPhoneNumber.getNationalNumber();
    const countryCode =
      typeof parsedPhoneNumber === "string"
        ? null
        : parsedPhoneNumber.getCountryCode();
    const foundUser = await UserRepository.getUserByPhoneNumber(
      nationalPhoneNumber,
      countryCode
    );
    console.log(
      new Date() +
        " -> LOG::Info::UserService::checkDoesUserExistWithPhoneNumber::foundUser::Result of database search for user with phone number returned: " +
        foundUser
    );
    if (!foundUser) {
      return new ReturnObjectHandler(
        "User with phone number with value: " + phoneNumber + " does not exist",
        false
      );
    }
    return new ReturnObjectHandler(
      "User with phone number " + phoneNumber + " exists",
      true
    );
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

  private static async createNewUserWithPhoneNumber(
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
    if (!userCreationResult) {
      return new ReturnObjectHandler("Could not create new user", null);
    }
    return new ReturnObjectHandler(
      "Created new user with ID: " + userCreationResult.returnValue.userID,
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

  private static async createNewPhoneNumber(
    phoneNumber: string,
    userToCreatePhoneNumberFor: User,
    countryCode: string = null
  ) {
    const createdPhoneNumber: ReturnObjectHandler<UserPhoneNumber> =
      await UserRepository.createNewUserPhoneNumber(
        phoneNumber,
        userToCreatePhoneNumberFor,
        countryCode
      );

    return createdPhoneNumber;
  }

  private static async createNewPassword(
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

  private static async createNewSalt(createSaltForUser: User) {
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
    const createdPassword = await this.createNewPassword(
      password,
      userCreationResult.returnValue
    );

    if (!createdPassword.returnValue) {
      return new ReturnObjectHandler(
        "Could not create new password for user",
        null
      );
    }

    const createdSalt = await this.createNewSalt(
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

  public static async registerUserWithPhoneNumber(
    firstName: string = null,
    lastName: string = null,
    username: string = null,
    phoneNumber: string,
    password: string
  ) {
    console.log(
      new Date() +
        " -> LOG::Info::UserService::registerUserWithPhoneNumber::paramater values and types (output format variable: type = value):" +
        "\nfirstName: " +
        typeof firstName +
        " = " +
        firstName +
        "\nlastName: " +
        typeof lastName +
        " = " +
        lastName +
        "\nusername: " +
        typeof username +
        " = " +
        username +
        "\nphoneNumber: " +
        typeof phoneNumber +
        " = " +
        phoneNumber +
        "\npassword: " +
        typeof password +
        " = " +
        password
    );
    //Control input - check are required values provided
    if (!phoneNumber ) {
      return new ReturnObjectHandler("Phone number must be provided", null);
    }
    if (!password) {
      return new ReturnObjectHandler("Password must be provided", null);
    }

    //Validate input of optional values
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

    //Parse phone number input, get either only phone number (nationalPhoneNumber has value of parsedPhoneNumber, countryCode has value of null), or national phone number with country code (nationalPhoneNumber has value of parsedPhoneNumber object type of libphonenumber.PhoneNumber with used function getNationalNumber, and countryCode has value of parsedPhoneNumber object type of libphonenumber.PhoneNumber with used function getCountryCode)
    let parsedPhoneNumber;
    console.log(
      new Date() +
        " -> LOG::Info::UserService::registerUserWithPhoneNumber::parameter phoneNumber has value of before parsing: " +
        phoneNumber +
        " and parsedPhoneNumber has value of: " +
        parsedPhoneNumber
    );

    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      return new ReturnObjectHandler(error.message, null);
    }

    //Check is phone number already taken
    const isNumberTaken =
      await this.checkDoesUserExistWithPhoneNumber_WithParsing(phoneNumber);
    console.log(
      new Date() +
        " -> LOG::Info::UserService::registerUserWithPhoneNumber::isNumberTaken::return message: " +
        isNumberTaken.getMessage() +
        "::value: " +
        isNumberTaken.returnValue
    );
    if (isNumberTaken.returnValue === true) {
      return new ReturnObjectHandler(
        "Phone number " + phoneNumber + " is taken",
        null
      );
    }
    if (isNumberTaken.returnValue === null) {
      return new ReturnObjectHandler(
        "Error occured creating phone number, error message: " +
          isNumberTaken.getMessage(),
        null
      );
    }

    //Either use only phone number or phone number with country code
    let nationalPhoneNumber;
    let countryCodeForPhoneNumber;

    if (typeof parsedPhoneNumber === "string") {
      nationalPhoneNumber = parsedPhoneNumber;
      countryCodeForPhoneNumber = null;
    }
    if (typeof parsedPhoneNumber !== "string") {
      nationalPhoneNumber = parsedPhoneNumber.getNationalNumber();
      countryCodeForPhoneNumber = parsedPhoneNumber.getCountryCode();
    }

    //Try to create new user in database with given data
    const newUserCreationResult = await this.createNewUserWithPhoneNumber(
      firstName,
      lastName,
      username
    );
    if (!newUserCreationResult.returnValue) {
      return newUserCreationResult;
    }
    //newUser constant which stores returnValue from returned object, which represents newly created user  in the database
    const newUser = newUserCreationResult.returnValue;

    //constant for phoneNumber object from the database for the given user
    const newPhoneNumber = await this.createNewPhoneNumber(
      nationalPhoneNumber,
      newUser,
      countryCodeForPhoneNumber
    );
    if (!newPhoneNumber.returnValue) {
      return newPhoneNumber;
    }

    //constant for user password object

    const newPassword = await this.createNewPassword(password, newUser);
    if (!newPassword.returnValue) {
      return new ReturnObjectHandler("Could not create password", null);
    }

    const newSalt = await this.createNewSalt(newUser);
    if (!newSalt.returnValue) {
      return new ReturnObjectHandler("Could not create new salt", null);
    }

    return new ReturnObjectHandler(
      "Successfully created new user using phone number, returning created data for objects User, UserPhoneNumber, UserPassword, UserSalt",
      {
        user: newUser,
        phoneNumber: newPhoneNumber.returnValue,
        password: newPassword.returnValue,
        salt: newSalt.returnValue,
      }
    );
  }
}
