import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import DataSanitation from "../../helpers/sanitation.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
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
    usedEmailForSignUp: string
  ) {
      
      
  }
  public static async createNewUserByEmail(
    firstName: string = null,
    lastName: string = null,
    username: string = null,
    email: string
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

      
      const parsedEmail = DataSanitation.
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
}
