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
  ): Promise<User> {
    const newUser = new User();
    newUser.username = username;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.createdAt = new Date();
    newUser.modifiedAt = new Date();

    const newUserAddingResult = await DatabaseConnection.getRepository(
      User
    ).save(newUser);

    if (!newUserAddingResult) {
      throw new Error("Failed to add new user");
    }

    const newUserPassword = new UserPassword();
    newUserPassword.hash = await EncryptionHelpers.hashPassword(password);
    newUserPassword.salt = await EncryptionHelpers.generateSalt();
    newUserPassword.userID = newUser;
    newUserPassword.createdAt = new Date();
    newUserPassword.updatedAt = new Date();

    const passwordGenerationResult = await DatabaseConnection.getRepository(
      UserPassword
    ).save(newUserPassword);

    if (!passwordGenerationResult) {
      throw new Error("Failed to add new user password");
    }

    const newUserEmail = new UserEmail();
    newUserEmail.email = email;
    newUserEmail.createdAt = new Date();
    newUserEmail.modifiedAt = new Date();
    newUserEmail.userID = newUser;

    const newUserEmailGenerationResult = await DatabaseConnection.getRepository(
      UserEmail
    ).save(newUserEmail);

    if (!newUserEmailGenerationResult) {
      throw new Error("Failed to add new user email");
    }

    console.log(
      "LOG::UserRepository::createNewUser - result: successfully generated user with username: " +
        username +
        " and email: " +
        email
    );
    return newUser;
  }
    
    public static async createNewUserHash(userToCreateHashFor: User): Promise<UserHash> { 

        const newUserHash = new UserHash();
        new
    }
}
