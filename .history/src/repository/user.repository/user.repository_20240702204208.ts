import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPhoneNumber from "../../models/user.model/phone.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import { DatabaseConnection } from "../../database/config.database";
import EncryptionHelpers from "../../helpers/encryption.helper";

export default class UserRepository {
  public static async createNewUserByEmail(
    firstName: string = null,
    lastName: string = null,
    username: string = null,
    usedEmailToSignUp: boolean = true
  ) {
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.username = username;
    newUser.usedEmailToSignUp = usedEmailToSignUp;
    newUser.createdAt = new Date();

    const userCreationResult = await DatabaseConnection.getRepository(
      User
    ).save(newUser);

    if (!userCreationResult) {
      console.log(new Date() + " Failed to create new User");
      return null;
    }
    return newUser;
  }

  public static async createNewUserEmail(
    email: string,
    userToCreateEmailFor: User
  ) {
    const newEmail = new UserEmail();
    newEmail.user = userToCreateEmailFor;
    newEmail.email = email;
    newEmail.createdAt = new Date();

    const emailCreationResult = await DatabaseConnection.getRepository(
      UserEmail
    ).save(newEmail);
    if (!emailCreationResult) {
      return null;
    }

    return newEmail;
  }

  public static async createUserPassword(
    passwordHash: string,
    userToCreatePasswordFor: User
  ) {
    const newPassword = new UserPassword();
    newPassword.salt = await EncryptionHelpers.generateSalt();
    newPassword.hash = passwordHash;
    newPassword.createdAt = new Date();
    newPassword.user = userToCreatePasswordFor;

    const passwordCreationResult = await DatabaseConnection.getRepository(
      UserPassword
    ).save(newPassword);
    if (!passwordCreationResult) {
      return null;
    }
    return newPassword;
  }

  public static async createNewUserSalt(createSaltForUser: User) {
    const newSalt = new UserSalt();
    newSalt.salt = await EncryptionHelpers.generateSalt();
    newSalt.createdAt = new Date();
    newSalt.saltOwner = createSaltForUser;

    const newSaltCreationResult = await DatabaseConnection.getRepository(
      UserSalt
    ).save(newSalt);
    if (!newSaltCreationResult) {
      return null;
    }
    return newSalt;
  }
}
