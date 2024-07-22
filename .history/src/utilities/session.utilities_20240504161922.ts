import Session from "../models/session.model";
import SessionRepository from "../repository/session.repository";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";
import JWTHelper from "helpers/jwtokens.helpers";

export default class SessionManager {
  constructor() {}

  static async generateNewSession(
    forUser: User,
    {
      sessionExpiry = new Date(Date.now() + 12 * 3600 * 1000),
    }: { sessionExpiry?: Date }
  ) {
    const isUserSessionActive =
      SessionRepository.getActiveSessionByUser(forUser);
    if (isUserSessionActive) {
      throw Error("User has already an active session");
    }

    const newSession = new Session();
    newSession.createdBy = forUser;
    newSession.isActive = true;
    newSession.expires = sessionExpiry;
    newSession.sessionToken = JWTHelper.generateToken({
      username: forUser.username,
      email: forUser.email,
      salt: forUser.salt,
    });
      
    const sessionInitializationResult = Session
  }
}
