import { DatabaseConnection } from "../database/config.database";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";
import Session from "../models/session.model";

export default class SessionRepository {
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
  }

  static async generateNewSession(
    newSession: Session
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    sessionRepository.save(newSession);
    return newSession;
  }

  static async getSessionBySessionToken(sessionToken): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: {
        token: sessionToken,
      },
    });
    return session;
  }

  static async getSessionByUser(
    sessionOwnerUser: User
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: {
        createdBy: sessionOwnerUser,
      },
      relations: {
        createdBy: true,
      },
    });
    return session;
  }

  static async destroySessionBySessionToken(
    sessionToken: string
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: {
        token: sessionToken,
      },
    });
    if (!session) return null;

    const sessionDestructionResult = await sessionRepository.delete(session);
    if (sessionDestructionResult.affected == 0) return null;
    return session;
  }
    
static async destroySessionByUser(
    sessionOwnerUser: User
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: {
        createdBy: sessionOwnerUser,
      },
      relations: {
        createdBy: true,
      },
    });
    if (!session) return null;
}
