import User from "../../models/user.model/user.model";
import UserPassword from "../../models/user.model/password.model";
import UserEmail from "../../models/user.model/email.model";
import UserHash from "../../models/user.model/hash.model";
import UserVerificationToken from "models/user.model/verificationToken.model";
import { DatabaseConnection } from "../../database/config.database";
import EncryptionHelpers from "../../helpers/encryption.helper";
import UserPhoneNumber from "../../models/user.model/phone.model";
export default class UserRepository {
  public static async createNewUserByEmail(
    email: string,
    password: string,
    firstName: string = null,
    lastName: string = null
  ): Promise<User | null> {
    const newUser = new User();
    newUser.username = null;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.usedEmailToSignUp = true;
    newUser.createdAt = new Date();
    newUser.modifiedAt = null;
    const newUserCreationResult = await DatabaseConnection.getRepository(
      User
    ).save(newUser);

    if (!newUserCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUserByEmail::newUserCreationResult::Could not create new user"
      );
      return null;
    }
    const newUserPassword = new UserPassword();
    newUserPassword.hash = await EncryptionHelpers.hashPassword(password);
    newUserPassword.salt = await EncryptionHelpers.generateSalt();
    newUserPassword.createdAt = new Date();
    newUserPassword.userID = newUser;
    newUserPassword.updatedAt = null;

    const newUserPasswordCreationResult =
      await DatabaseConnection.getRepository(UserPassword).save(
        newUserPassword
      );
    if (!newUserPasswordCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUser::newUserPasswordCreationResult::Could not create new user password"
      );
      return null;
    }

    const newUserEmail = new UserEmail();
    newUserEmail.email = email;
    newUserEmail.userID = newUser;
    newUserEmail.createdAt = new Date();
    newUserEmail.modifiedAt = null;
    console.log("Email: " + email);
    console.log("User email: " + newUserEmail.email);
    const newUserEmailCreationResult = await DatabaseConnection.getRepository(
      UserEmail
    ).save(newUserEmail);

    if (!newUserEmailCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUser::newUserEmailCreationResult::Could not create new user email"
      );
      return null;
    }

    console.log(
      new Date() +
        " -> LOG::SUCCESS:UserRepository::createNewUser::User created with, id: " +
        newUser.userID +
        ", email: " +
        newUserEmail.email +
        ", username: " +
        newUser.username
    );

    return newUser;
  }

  public static async createUserByPhoneNumber(
    phoneNumber: string,
    password: string,
    callingCode: string,
    firstName: string = null,
    lastName: string = null
  ): Promise<User | null> {
    const newUser = new User();
    newUser.username = null;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.usedEmailToSignUp = false;
    newUser.createdAt = new Date();
    newUser.modifiedAt = null;
    const newUserCreationResult = await DatabaseConnection.getRepository(
      User
    ).save(newUser);

    if (!newUserCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUserByPhoneNumber::newUserCreationResult::Could not create new user"
      );
      return null;
    }
    const newUserPassword = new UserPassword();
    newUserPassword.hash = await EncryptionHelpers.hashPassword(password);
    newUserPassword.salt = await EncryptionHelpers.generateSalt();
    newUserPassword.createdAt = new Date();
    newUserPassword.userID = newUser;
    newUserPassword.updatedAt = null;

    const newUserPasswordCreationResult =
      await DatabaseConnection.getRepository(UserPassword).save(
        newUserPassword
      );
    if (!newUserPasswordCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUser::newUserPasswordCreationResult::Could not create new user password"
      );
      return null;
    }

    const newUserPhoneNumber = new UserPhoneNumber();
    newUserPhoneNumber.phoneNumber = phoneNumber;
    newUserPhoneNumber.phoneNumberOwner = newUser;
    newUserPhoneNumber.internationalCallingCode = callingCode;
    newUserPhoneNumber.createdAt = new Date();

    const newUserPhoneNumberCreationResult =
      await DatabaseConnection.getRepository(UserPhoneNumber).save(
        newUserPhoneNumber
      );

    if (!newUserPhoneNumberCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUserByPhoneNumber::newUserPhoneNumberCreationResult::Could not create new user phone number"
      );
      return null;
    }

    console.log(
      new Date() +
        " -> LOG::SUCCESS:UserRepository::createNewUserByPhoneNumber::User created with, id: " +
        newUser.userID +
        ", phone number: " +
        newUserPhoneNumber.phoneNumber +
        ", username: " +
        newUser.username
    );

    return newUser;
  }

  public static async createUserHash(
    newHashOwner: User
  ): Promise<UserHash | null> {
    const newUserHash = new UserHash();
    newUserHash.salt = await EncryptionHelpers.generateSalt();
    newUserHash.saltOwner = newHashOwner;
    newUserHash.createdAt = new Date();
    const hashCreationResult = await DatabaseConnection.getRepository(
      UserHash
    ).save(newUserHash);
    if (!hashCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createUserHash::hashCreationResult::Could not create new user hash"
      );
      return null;
    }
    return newUserHash;
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    const userEmail = await DatabaseConnection.getRepository(UserEmail).findOne(
      {
        where: {
          email: email,
        },
        relations: {
          userID: true,
        },
      }
    );
    if (!userEmail) {
      console.log(
        new Date() +
          " -> LOG::Info::UserRepository::getUserByEmail::User with email: " +
          email +
          " not found"
      );
      return null;
    }
    return userEmail.userID;
  }

  public static async getUserByPhoneNumber(
    phoneNumber: string
  ): Promise<User | null> {
    const userPhoneNumber = await DatabaseConnection.getRepository(
      UserPhoneNumber
    ).findOne({
      where: {
        phoneNumber: phoneNumber,
      },
      relations: {
        phoneNumberOwner: true,
      },
    });
    if (!userPhoneNumber) {
      console.log(
        new Date() +
          " -> LOG::Info::UserRepository::getUserByPhoneNumber::User with phone number: " +
          userPhoneNumber +
          " not found"
      );
      return null;
    }
    return userPhoneNumber.phoneNumberOwner;
  }
}
