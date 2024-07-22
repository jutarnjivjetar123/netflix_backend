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

    const newUserCreationResult = await DatabaseConnection.getRepository(
      User
    ).save(newUser);

    if (!newUserCreationResult) { 
      console.log("LOG::Error::UserRepository::createNewUser::")
    }
  }
}
