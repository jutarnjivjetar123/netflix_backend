import User from "../models/user.model";
import { DatabaseConnection } from "../database/config.database";
export default class UserRepository {
  constructor() {
      try {
        DatabaseConnection.initialize().then()
    } catch (error) {
      console.log("Error initializing a new User Repository", error);
    }
  }
}
