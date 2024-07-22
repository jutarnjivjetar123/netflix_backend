import Session from "../models/session.model";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwtokens.helpers";
import { DatabaseConnection } from "../database/config.database";
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

  async createSession(
    user: User,
    sessionToken: string,
    expires: Date
  ): Promise<Session> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = new Session();
    session.sessionToken = JWTHelper.generateToken({
      username: user.username,
      email: user.email,
      salt: user.salt,
    }, );
    session.expires = expires;
    session.isActive = true;
    session.createdBy = user;
    return await sessionRepository.save(session);
  }
}
