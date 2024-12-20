import Session from "../models/session.model";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwtokens.helpers";
import { DatabaseConnection } from "../database/config.database";
import { LessThan } from "typeorm";
export default class SessionRepository {
  constructor() {
    DatabaseConnection.initialize()
      .then(() =>
        console.log(
          "New connection to Session repository on the database successfully initialized"
        )
      )
      .catch((error) =>
        console.log("Error initializing database connection", error)
      );
  }
  catch(error) {
    console.log("Error initializing a new Session Repository", error);
  }

  async createSession(user: User, expires: Date): Promise<Session> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = new Session();
    session.sessionToken = JWTHelper.generateToken(
      {
        username: user.username,
        email: user.email,
        salt: user.salt,
      },
      expires.toString()
    );
    session.expires = expires;
    session.isActive = true;
    session.createdBy = user;
    return await sessionRepository.save(session);
  }

  async removeSession(session: Session): Promise<void> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    await sessionRepository.remove(session);
  }

  async removeExpiredSessions(): Promise<void> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    await sessionRepository.delete({ expires: LessThan(new Date()) });
  }
  async verifySession(sessionToken: string): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: { sessionToken, isActive: true },
      relations: ["createdBy"],
    });
    const decodedToken = JWTHelper.validateToken(sessionToken);
    if (typeof decodedToken === "string") {
      return null;
    }
    if (session && session.expirexs > new Date()) {
      return session;
    }
    return null;
  }
}
