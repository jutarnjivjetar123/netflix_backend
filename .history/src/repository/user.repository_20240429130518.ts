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

  static async registerUser(newUser: User): Promise<User | null> {
    
    const userRepository = DatabaseConnection.getRepository(User);
    const userRegistrationResult = await userRepository.save(newUser);
    if(userRegistrationResult)

  }
}
