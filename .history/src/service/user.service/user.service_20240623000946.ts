import User from "models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserRepository from "repository/user.repository/user.repository";
import validator from "validator";

export default class UserService {
  public static async createAndValidateNewUser(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User> {
    //TODO: create input control and validation
    //TODO: create new user
    //TODO: create new user hash
      //TODO: return confirmation of successful registration or failure to sign up new user
      //TODO: Create sanitazion and validation od user data class
      
      const newUser = await 
  }
}
