import { DatabaseConnection } from "../database/config.database";
import Session from "../models/session.model";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";

export default class SessionRepository {
  constructor() {
    DatabaseConnection.initialize().then(() => {
      console.log(
        "Database connection for Session Repository has been successfully initialized."
      );
    }).catch(() => console.log("Error initiali") );
  }
}
