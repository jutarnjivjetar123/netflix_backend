import Session from "../models/session.model";
import User from "../models/user.model";
import { DatabaseConnection } from "../database/config.database";

/*
TODO Methods:
addNewSession - Done
deactivateCurrentSession - Done
removeSession - Done
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

  static async setSessionActiveToFalse(currentSession: Session) {
    currentSession.isActive = false;
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessionDeactivationResult = await sessionRepository.save(
      currentSession
    );
    if (!sessionDeactivationResult) return null;
    return currentSession;
  }

  static async removeSession(session: Session) {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessionRemovalResult = sessionRepository.delete(session);
    if (!sessionRemovalResult) return null;
    return session;
  }

  static async removeAllExpiredSessions() {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessionRemovalResult = await sessionRepository.delete();
  }
}