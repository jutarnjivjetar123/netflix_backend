import { DatabaseConnection } from "../database/config.database";
import Session from "../models/session.model";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";

export default class SessionRepository {
  constructor() {
    DatabaseConnection.initialize()
      .then(() => {
        console.log(
          "Database connection for Session Repository has been successfully initialized."
        );
      })
      .catch((error) =>
        console.log(
          "Error initializing database connection for Session Repository, error: " +
            error
        )
      );
  }

  static async generateNewSession(
    newSession: Session
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessionGenerationResult = await sessionRepository.save(newSession);
    if (!sessionGenerationResult) return null;
    return newSession;
  }

    static async validateSessionBySessionToken(sessionToken: string): Promise<boolean> { 
        const sessionRepository = DatabaseConnection.getRepository(Session);
        const session = awa
    }
}
