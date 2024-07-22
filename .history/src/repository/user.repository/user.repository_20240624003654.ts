import User from "models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserHash from "models/user.model/hash.model";
import UserVerificationToken from "models/user.model/verificationToken.model";
import { DatabaseConnection } from "database/config.database";
import EncryptionHelpers from "helpers/encryption.helper";
export default class UserRepository {
  public static async createNewUser(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User | null> {
    const newUser = new User();
    newUser.username = username;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.createdAt = new Date();
    newUser.modifiedAt = null;
    const newUserCreationResult = await DatabaseConnection.getRepository(
      User
    ).save(newUser);

    if (!newUserCreationResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRepository::createNewUser::newUserCreationResult::Could not create new user"
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
      "LOG::SUCCESS:UserRepository::createNewUser::User created with, id: " +
        newUser.userID +
        ", email: " +
        newUserEmail.email +
        ", username: " +
        newUser.username
    );
  }
}