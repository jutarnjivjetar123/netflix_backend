import Session from "../models/session.model";
import User from "../models/user.model";
import { DatabaseConnection } from "../database/config.database";

import { LessThan, MoreThan } from "typeorm";
import User from "../../.history/src/models/user.model_20240428212400";
/*
TODO Methods:
addNewSession - Done
deactivateCurrentSession - Done
removeSession - Done
removeAllExpiredSessions - Done
getSessionById - Done
getActiveSessionByUser - Done
getSessionsByDateTime - Done 
getSessionsByDateTimeInterval - 
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
    const sessionRemovalResult = await sessionRepository
      .createQueryBuilder()
      .delete()
      .from(Session)
      .where("expires = :expires", {
        expires: LessThan(Date.now()),
      })
      .execute();

    return sessionRemovalResult;
  }

  static async getSessionById(sessionId: string): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    return await sessionRepository.findOne({
      where: {
        id: sessionId,
      },
    });
  }

  static async getActiveSessionByUser(
    sessionOwner: User
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: {
        createdBy: sessionOwner,
        isActive: true,
      },
      relations: {
        createdBy: true,
      },
    });

    return session;
  }

  static async getSessionsByDateTime(
    sessionDateTime: Date
  ): Promise<Session[]> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessions = await sessionRepository.find({
      where: {
        expires: sessionDateTime,
      },
    });
    return sessions;
  }

  static async getSessionByDateTimeInterval(
    startingInterval: Date,
    endingInterval: Date
  ): Promise<Session[]> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = sessionRepository.find({
      where: {
        expires: LessThan(endingInterval) && MoreThan(startingInterval),
      },
      relations: {
        createdBy: true,
      },
    });
  }
}
