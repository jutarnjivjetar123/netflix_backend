import User from "../../models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserRepository from "../../repository/user.repository/user.repository";
import UserHash from "models/user.model/hash.model";
import validator from "validator";
import DataSanitazion from "../../helpers/sanitation.helpers";
import UserRepo from "../../../.history/src/repository/user.repository_20240429001544";
import PhoneNumberHelper from "../../helpers/phoneNumber.helpers";
export default class UserService {
  public static async createAndValidateNewUserByEmail(
    email: string,
    password: string,
    firstName: string = null,
    lastName: string = null
  ): Promise<User | null> {
    //TODO: create input control - Done and validation
    //TODO: create new user - DONE
    //TODO: create new user hash - DONE
    //TODO: return confirmation of successful registration or failure to sign up new user
    //TODO: Create sanitazion and validation od user data class - DONE

    if (!email || !password) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUser::NoVariableSpecified::Missing required variables::Could not create new user"
      );
      return null;
    }

    email = DataSanitazion.sanitizeEmail(email);

    password = DataSanitazion.removeAllWhitespaces(password);
    password = DataSanitazion.replaceHTMLTagsWithEmptyString(password);

    firstName =
      DataSanitazion.sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhitespacesRemoval(
        firstName
      );

    lastName =
      DataSanitazion.sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhitespacesRemoval(
        lastName
      );
    const userCreationInTheDatabaseResult =
      await UserRepository.createNewUserByEmail(
        (email = email),
        (password = password),
        (firstName = firstName),
        (lastName = lastName)
      );
    if (!userCreationInTheDatabaseResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUser::userCreationInTheDatabaseResult::Could not create new user"
      );
      return null;
    }

    const userHashCreationInTheDatabaseResult =
      await UserRepository.createUserHash(userCreationInTheDatabaseResult);

    if (!userHashCreationInTheDatabaseResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUser::userHashCreationInTheDatabaseResult::Could not create new user hash"
      );
      return null;
    }
    console.log(
      new Date() +
        " -> LOG::Partial Success::UserService::createAndValidateNewUser::userHashCreationInTheDatabaseResult::Created a new hash for user: " +
        userCreationInTheDatabaseResult.username +
        " with value : " +
        userHashCreationInTheDatabaseResult.salt
    );

    console.log(
      new Date() +
        " -> LOG::Success::UserService::createAndValidateNewUser::userCreationInTheDatabaseResult::Successfully created new user::New user data: ID: " +
        userCreationInTheDatabaseResult.userID +
        " with username: " +
        userCreationInTheDatabaseResult.username +
        " and createdAt timestamp: " +
        userCreationInTheDatabaseResult.createdAt
    );
    return userCreationInTheDatabaseResult;
  }

  public static async createAndValidateNewUserByPhoneNumber(
    phoneNumber: string,
    password: string,
    firstName: string = null,
    lastName: string = null,
    callingCode: string
  ): Promise<User | null> {
    if (!phoneNumber || !password) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUserByPhoneNumber::NoVariableSpecified::Missing required variables::Could not create new user"
      );
      return null;
    }

    //missing phone number sanitazion

    phoneNumber = PhoneNumberHelper.
    password = DataSanitazion.removeAllWhitespaces(password);
    password = DataSanitazion.replaceHTMLTagsWithEmptyString(password);

    if (firstName) {
      firstName =
        DataSanitazion.sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhitespacesRemoval(
          firstName
        );
    }
    if (lastName) {
      lastName =
        DataSanitazion.sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhitespacesRemoval(
          lastName
        );
    }

    const createdUser = await UserRepository.createUserByPhoneNumber(
      phoneNumber,
      password,
      firstName,
      lastName,
      callingCode
    );
    if (!createdUser) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUserByPhoneNumber::createdUser::Could not create new user"
      );
      return null;
    }

    const createdHash = await UserRepository.createUserHash(createdUser);

    if (!createdHash) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUserByPhoneNumber::createdHash::Could not create new user hash"
      );
      return null;
    }

    console.log(
      new Date() +
        " -> LOG::Partial Success::UserService::createAndValidateNewUserByPhoneNumber::createdHash::Created a new hash for user: " +
        createdUser.username +
        " with value : " +
        createdHash.salt
    );

    console.log(
      new Date() +
        " -> LOG::Success::UserService::createAndValidateNewUserByPhoneNumber::createdUser::Successfully created new user::New user data: ID: " +
        createdUser.userID +
        " with username: " +
        createdUser.username +
        " and createdAt timestamp: " +
        createdUser.createdAt
    );

    return createdUser;
  }
  public static async checkIfUserExistsWithEmail(
    email: string
  ): Promise<boolean> {
    const userExist = await UserRepository.getUserByEmail(email);
    if (userExist) {
      console.log(
        new Date() +
          " -> LOG::Info::UserService::checkIfUserExistWithEmail::userExists::Found existing user with email: " +
          email +
          ", username: " +
          userExist.username +
          ", ID: " +
          userExist.userID
      );
      return true;
    }
    console.log(
      new Date() +
        " -> LOG::Info::UserService::checkIfUserExistWithEmail::userExists::No existing user with email: " +
        email
    );
    return false;
  }

  public static async checkIfUserExistsWithPhoneNumber(
    phoneNumber: string,
    callingCode: string = null
  ): Promise<boolean> {
    const userExists = await UserRepository.getUserByPhoneNumber(
      phoneNumber,
      callingCode
    );
    if (userExists) {
      console.log(
        new Date() +
          " -> LOG::Info::UserService::checkIfUserExistWithPhoneNumber::userExists::Found existing user with phone number: " +
          "(" +
          callingCode
          ? callingCode
          : "-" +
              ")" +
              phoneNumber +
              ", username: " +
              userExists.username +
              ", ID: " +
              userExists.userID
      );
      return true;
    }
    console.log(
      new Date() +
        " -> LOG::Info::UserService::checkIfUserExistWithPhoneNumber::userExists::No existing user with phone number: " +
        phoneNumber
    );
    return false;
  }
}
