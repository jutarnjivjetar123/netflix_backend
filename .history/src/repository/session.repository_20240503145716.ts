import Session from "../models/session.model";
import { DatabaseConnection } from "../database/config.database";
import User from "models/user.model";

export default class SessionRepository {
  constructor() {
    try {
      DatabaseConnection.initialize()
        .then(() =>
          console.log(
            "New connection to Session repository on the database successfully initialized"
          )
        )
        .catch((error) =>
          console.log("Error initializing database connection", error)
        );
    } catch (error) {
      console.log("Error initializing a new Session Repository", error);
    }
  }

  static async setNewSession(newSession: Session): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
      const sessionCreationResult = await sessionRepository.save(newSession);
      
  }
}
