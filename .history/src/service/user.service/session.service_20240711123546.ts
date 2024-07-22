import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";


export default class SessionService {
  public static async createNewSession(
    userToCreateSessionFor: User,
    expiresAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    ipAddress: string,
    userAgent: string,
    sessionData: string
  ) {
    const newSessionCreationResult = await SessionRepository.createNewSession(
      userToCreateSessionFor,

    );
  }
  
}
