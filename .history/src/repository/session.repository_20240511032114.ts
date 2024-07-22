import { DatabaseConnection } from "../database/config.database";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";
import Session from "../models/session.model";

export default class SessionRepository {
  private static sessionRepository;
  constructor() {
    DatabaseConnection.initialize()
      .then(() =>
        console.log(
          "LOG::SESSION REPOSITORY::SUCCESS::New connection to database using SessionRepository was successfully established."
        )
      )
      .catch(() =>
        console.log(
          "LOG::SESSION REPOSITORY::ERROR::Error establishing connection to database using Session Repository"
        )
      );
    SessionRepository.sessionRepository =
      DatabaseConnection.getRepository(Session);
  }
    
    static async generateNewSession(generatingForUser: User): Promise<Session | null> { 

        const newSession = Session
    }
}
