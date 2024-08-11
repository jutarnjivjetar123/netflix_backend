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
    let parsedPhoneNumber;
    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      throw new Error(error);
    }
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

    if (
      await UserRepository.doesUserExistWithPhoneNumber(
        nationalPhoneNumber,
        countryCode
      )
    ) {
      throw new Error("Phone number is taken");
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
      nationalPhoneNumber,
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
    console.log("Login data: " + JSON.stringify(loginData));
    console.log(loginData.user.userID);
    if (loginData.user.userID === undefined) {
      throw new Error("User with " + email + " not found");
    }
    return loginData;
  }
}
