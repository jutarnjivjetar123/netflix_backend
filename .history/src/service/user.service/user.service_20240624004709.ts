import User from "models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserRepository from "repository/user.repository/user.repository";
import UserHash from "models/user.model/hash.model";
import validator from "validator";

export default class UserService {
  public static async createAndValidateNewUser(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User | null> {
    //TODO: create input control and validation
    //TODO: create new user - DONE
    //TODO: create new user hash
    //TODO: return confirmation of successful registration or failure to sign up new user
    //TODO: Create sanitazion and validation od user data class

    if (!username || !email || !password || !firstName || !lastName) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUser::NoVariableSpecified::Missing required variables::Could not create new user"
      );
      return null;
    }

    const userCreationInTheDatabaseResult = await UserRepository.createNewUser(
      username,
      email,
      password,
      firstName,
      lastName
    );
    if (!userCreationInTheDatabaseResult) {
      console.log(
        new Date() +
          " -> LOG::Error::UserService::createAndValidateNewUser::userCreationInTheDatabaseResult::Could not create new user"
      );
      return null;
    }

    console.log(
      new Date() +
        " -> LOG::Success::UserService::createAndValidateNewUser::userCreationInTheDatabaseResult::Successfully created new user::New user data: ID: " +
        userCreationInTheDatabaseResult.userID +
        " with username: " +
        userCreationInTheDatabaseResult.username +
        " and createdAt timestamp: " +
        userCreationInTheDatabaseResult.createdAt
    );
    
  }
}
