import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import DataSanitation from "../../helpers/sanitation.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import EncryptionHelpers from "../../helpers/encryption.helper";
export default class UserService {
  public static async checkDoesUserExistWithEmail(
    email: string
  ): Promise<ReturnObjectHandler<boolean>> {
    email = DataSanitation.sanitizeEmail(email);
    const databaseSearchResult = await UserRepository.getUserByEmail(email);
    if (databaseSearchResult) {
      return new ReturnObjectHandler("Email " + email + " taken", true);
    }

    return new ReturnObjectHandler("Email not used", false);
  }

  private static async createNewUserObjectByEmail(
    firstName: string,
    lastName: string,
    username: string
  ) {
    const userCreationResult = await UserRepository.createNewUserByEmail(
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
  public static async createNewUserByEmail(
    firstName: string = null,
    lastName: string = null,
    username: string = null,
    email: string,
    password: string
  ): Promise<ReturnObjectHandler<User>> {
    if (!email) {
      return new ReturnObjectHandler("Email must be provided", null);
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

    const createdSalt = this.createNewUserSaltObjectForUser(newUser)
    return new ReturnObjectHandler<User>(
      "User created successfully with the following data: " +
        JSON.stringify({
          username: userCreationResult.returnValue.username,
          firstName: userCreationResult.returnValue.firstName,
          lastName: userCreationResult.returnValue.lastName,
        }),
      userCreationResult.returnValue
    );
  }
}
