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
  ): Promise<ReturnObjectHandler> {
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
        
    )
}
