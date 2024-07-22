import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";
import SessionRepo from '../../../.history/src/repository/user.repository/session.repository_20240710115711';

export default class SessionService {
  public static async createNewSession(
    userToCreateSessionFor: User,
    ipAddress: string,
    userAgent: string,
    sessionData: string
  ) {
    const newSessionCreationResult = await SessionRepository.createNewSession();
  }
  
}
