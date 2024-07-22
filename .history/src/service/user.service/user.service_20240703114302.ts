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

  public static async createNewUserByEmail(
    firstName: string = null,
    lastName: string = null,
    username: string = null
  ): Promise<ReturnObjectHandler<User>> {
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
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            usedEmailToSignUp: newUser.usedEmailToSignUp,
          }),
        newUser
      );
  }
}
