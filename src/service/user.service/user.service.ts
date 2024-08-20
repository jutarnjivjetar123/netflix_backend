import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
import DataSanitation from "../../helpers/sanitation.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import UserSession from "../../models/user.model/session.model";
import EncryptionHelpers from "../../helpers/encryption.helper";
import validator, { isNumeric } from "validator";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import { parse } from "path";
import { PhoneNumber } from "google-libphonenumber";
import SessionRepository from "../../repository/user.repository/session.repository";

export default class UserService {
  // public static async loginUserWithPhoneNumber(
  //   phoneNumber: string,
  //   originIpAddress: string,
  //   userAgent: string = ""
  // ) {
  //   if (!phoneNumber) {
  //     return new ReturnObjectHandler(
  //       "Phone number must be provided to login",
  //       null
  //     );
  //   }
  //   let parsedPhoneNumber;
  //   try {
  //     parsedPhoneNumber =
  //       PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
  //   } catch (error) {
  //     return new ReturnObjectHandler(error.message, null);
  //   }
  //   let nationalPhoneNumber;
  //   let countryCodeForPhoneNumber;
  //   if (typeof parsedPhoneNumber === "string") {
  //     nationalPhoneNumber = parsedPhoneNumber;
  //     countryCodeForPhoneNumber = null;
  //   }
  //   if (typeof parsedPhoneNumber !== "string") {
  //     nationalPhoneNumber = parsedPhoneNumber.getNationalNumber();
  //     countryCodeForPhoneNumber = parsedPhoneNumber.getCountryCode();
  //   }
  //   const userToLogin = await UserRepository.getUserByPhoneNumber(
  //     nationalPhoneNumber,
  //     countryCodeForPhoneNumber
  //   );
  //   if (!userToLogin.userID) {
  //     return new ReturnObjectHandler(
  //       "User with phone number: " + phoneNumber + "does not exist",
  //       null
  //     );
  //   }
  //   return new ReturnObjectHandler("User was successfully logged in", {
  //     user: {
  //       userID: userToLogin.userID,
  //       username: userToLogin.username,
  //       firstName: userToLogin.firstName,
  //       lastName: userToLogin.lastName,
  //     },
  //   });
  // }

  public static async registerUserWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string
  ) {
    if (await UserRepository.doesUserExistWithEmail(email)) {
      throw new Error("Email is taken");
    }
    const newUser = await UserRepository.createNewUser(
      firstName,
      lastName,
      username
    );
    if (!newUser) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithEmail::Could not create new user, check UserRepository logs for more details"
      );
      return null;
    }
    //Email object
    const newEmail = await UserRepository.createEmailByUser(newUser, email);
    if (!newEmail) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithEmail::newEmail::Could not create new user email, check UserRepository logs for more details"
      );
      return null;
    }
    //Password object
    const newPassword = await UserRepository.createPasswordByUser(
      newUser,
      password
    );
    if (!newPassword) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithEmail::newPassword::Could not create new user password, check UserRepository logs for more details"
      );
      return null;
    }
    //Salt object
    const newSalt = await UserRepository.createSaltByUser(newUser);
    if (!newSalt) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithEmail::Could not create new user salt, check UserRepository logs for more details"
      );
      return null;
    }
    console.log(
      "[LOG - DATA] - " +
        new Date() +
        " -> LOG::Success::UserService::registerUserWithEmail::Registered new user with id: " +
        newUser.userID +
        " and email: " +
        email
    );
    return newUser;
  }

  public static async registerUserWithPhoneNumber(
    phoneNumber: string,
    countryCode: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string
  ) {
    //TODO: parse phone number, and validate it, if it is valid phone number, check does it have country code inside the phoneNumber parameter variable, if it does, extract only the phone number ie. national number, and then is the phone number taken, if it is not then register user, if it is then throw exception 'Phone number taken'

    let parsedPhoneNumber;
    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      throw new Error(error.message);
    }
    let nationalNumber;
    if (typeof parsedPhoneNumber !== "string") {
      nationalNumber = parsedPhoneNumber.getNationalNumber();
    }
    if (typeof parsedPhoneNumber === "string") {
      nationalNumber = parsedPhoneNumber;
    }
    console.log(nationalNumber);
    if (
      await UserRepository.doesUserExistWithPhoneNumber(
        nationalNumber,
        countryCode
      )
    ) {
      throw new Error("Phone number taken");
    }
    const newUser = await UserRepository.createNewUser(
      username,
      firstName,
      lastName
    );
    if (!newUser) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithPhoneNumber::Could not create new user, check UserRepository logs for more details"
      );
      return null;
    }
    //Phone number object
    const newPhoneNumber = await UserRepository.createPhoneNumberByUser(
      newUser,
      nationalNumber,
      countryCode
    );
    if (!newPhoneNumber) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithPhoneNumber::Could not create new phone number for user, check UserRepository logs for more details"
      );
      return null;
    }
    //Password object
    const newPassword = await UserRepository.createPasswordByUser(
      newUser,
      password
    );
    if (!newPassword) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithPhoneNumber::newPassword::Could not create new user password, check UserRepository logs for more details"
      );
      return null;
    }
    //Salt object
    const newSalt = await UserRepository.createSaltByUser(newUser);
    if (!newSalt) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::registerUserWithPhoneNumber::Could not create new user salt, check UserRepository logs for more details"
      );
      return null;
    }
    return newUser;
  }

  public static async loginUserWithEmail(email: string, password: string) {
    //Get user object, along with email, password, salt, and session object
    const loginData = await SessionRepository.getLoginDataForUserByEmail(email);

    if (loginData.user.userID === undefined) {
      throw new Error("User with not found");
    }
    if (loginData.session) {
      if (!(await SessionRepository.deleteSession(loginData.session))) {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Error::UserService::Delete session if statement::Could not delete session with session ID: " +
            loginData.session.sessionID,
          " check SessionRepository logs for more information"
        );
        throw new Error("Could not login user");
      }
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Success:UserService::loginUserWithEmail::Delete session if statement:: Successfully deleted session for user with ID: " +
          loginData.user.userID
      );
    }
    loginData.session = await SessionRepository.createSession(loginData.user);

    if (
      !(await EncryptionHelpers.validatePassword(
        password,
        loginData.password.hash
      ))
    ) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::loginUserWithEmail::Access denied for user with ID: " +
          loginData.user.userID +
          ", incorrect password"
      );
      throw new Error("Invalid password");
    }

    return loginData;
  }

  public static async loginUserWithPhoneNumber(
    phoneNumber: any,
    countryCode: any,
    password: any
  ) {
    let parsedPhoneNumber;
    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      throw new Error(error.message);
    }
    let nationalNumber;
    if (typeof parsedPhoneNumber === "string") {
      nationalNumber = parsedPhoneNumber;
    }
    if (typeof parsedPhoneNumber !== "string") {
      nationalNumber = parsedPhoneNumber.getNationalNumber();
    }

    const loginData = await SessionRepository.getLoginDataForUserByPhoneNumber(
      nationalNumber,
      countryCode
    );

    if (loginData.user.userID === undefined) {
      throw new Error("User with not found");
    }

    if (loginData.session) {
      if (!(await SessionRepository.deleteSession(loginData.session))) {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " -> LOG::Error::UserService::Delete session if statement::Could not delete session with session ID: " +
            loginData.session.sessionID,
          " check SessionRepository logs for more information"
        );
        throw new Error("Could not login user");
      }
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Success:UserService::Delete session if statement:: Successfully deleted session for user with ID: " +
          loginData.user.userID
      );
    }
    loginData.session = await SessionRepository.createSession(loginData.user);

    //Validate user password
    console.log(
      await EncryptionHelpers.validatePassword(
        password,
        loginData.password.hash
      )
    );
    if (
      !(await EncryptionHelpers.validatePassword(
        password,
        loginData.password.hash
      ))
    ) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " -> LOG::Error::UserService::loginUserWithPhoneNumber::Access denied for user with ID: " +
          loginData.user.userID +
          ", incorrect password"
      );
      throw new Error("Invalid password");
    }
    return loginData;
  }
}
