import User from "../../models/user.model/user.model";
import UserSession from "../../models/user.model/session.model";
import SessionRepository from "../../repository/user.repository/session.repository";

export default class SessionService {
  public static createNewSession() {}
  public static async checkForAciveSessionByUser(user: User) {
    const doesUserHaveSession =
        await SessionRepository.checkDoesUserHaveActiveSessionByUser(user);
    
  }
}
