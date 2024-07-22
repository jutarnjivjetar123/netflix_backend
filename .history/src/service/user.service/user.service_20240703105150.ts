import User from "../../models/user.model/user.model";
import UserEmail from "../../models/user.model/email.model";
import UserPassword from "../../models/user.model/password.model";
import UserSalt from "../../models/user.model/salt.model";
import DataSanitation from "helpers/sanitation.helpers";
import UserRepository from "../.."
export default class UserService {
  public static async checkDoesUserExistWithEmail(
    email: string
  ): Promise<boolean> {
      email = DataSanitation.sanitizeEmail(email);
      U
  }
}
