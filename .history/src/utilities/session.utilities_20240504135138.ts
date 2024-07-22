import Session from "../models/session.model";
import SessionRepository from "../repository/session.repository";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";

export default class SessionManager {
  constructor() {}

  static async generateNewSession(
    forUser: User,
    { sessionExpiry }: { sessionExpiry: Date }
  ) {
    const isUserSessionActive =
      SessionRepository.getActiveSessionByUser(forUser);
    if (isUserSessionActive) {
      throw Error("User has already an active session");
    }

    const newSession = new Session();
      newSession.createdBy = forUser;
      newSession.isActive = true;
      expires
  }
}
