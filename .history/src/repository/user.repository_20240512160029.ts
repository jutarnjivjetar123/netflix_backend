import User from "../models/user.model";
import { DatabaseConnection } from "../database/config.database";
export default class UserRepository {
  constructor() {
    try {
      DatabaseConnection.initialize()
        .then(() =>
          console.log(
            "New connection to User repository on the database successfully initialized"
          )
        )
        .catch((error) =>
          console.log("Error initializing database connection", error)
        );
    } catch (error) {
      console.log("Error initializing a new User Repository", error);
    }
  }

  static async addNewUser(newUser: User): Promise<User | null> {
    const userRepository = DatabaseConnection.getRepository(User);
    const userRegistrationResult = await userRepository.save(newUser);

    console.log(
      "New user was successfully registered, with id: " +
        newUser.id +
        " and username " +
        newUser.username
    );
    if (!userRegistrationResult) return null;
    return userRegistrationResult;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const userRepository = DatabaseConnection.getRepository(User);
    const userResult = await userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!userResult) return null;

    return userResult;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const userRepository = DatabaseConnection.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      console.log(
        "LOG::USER REPOSITORY::ERROR::Could not find user with username: " +
          username
      );
      return null;
    }
    console.log(
      "LOG::USER REPOSITORY::SUCCESS::Found user with username: " +
        username +
        " and id: " +
        user.id
    );
    return user;
  }
}
