import Session from "../models/session.model";
import User from "../models/user.model";
import { DatabaseConnection } from "../database/config.database";

/*
TODO Methods:
addNewSession - Done
deactivateCurrentSession
removeSession
removeAllExpiredSessions
getAllSessionsById
getSessionById
getSessionByUser
getSessionsByDateTime
getSessionsByDateTimeInterval
getSessionBySessionToken

*/
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

  static async addNewSession(newSession: Session) {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessionRegistrationResult = await sessionRepository.save(newSession);
    if (!sessionRegistrationResult) return null;
    return sessionRegistrationResult;
  }

  static 
}
