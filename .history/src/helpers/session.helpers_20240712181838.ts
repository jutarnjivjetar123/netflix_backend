import User from "../models/user.model/user.model";
import UserSession from "../models/user.model/session.model";

import SessionService from "../service/user.service/session.service";

export default class SessionManager {
    public static async setSessionForUser(userToSetSessionFor: User, ) {
    const isSessionActive = await SessionService.isSessionActiveForUser(
      userToSetSessionFor
    );
    if (!isSessionActive) {
      const sessionDeletionResult =
        await SessionService.deleteSessionForUser_WithActiveSessionChecking(
          userToSetSessionFor
        );
        if (!sessionDeletionResult) return null;
        const new
    }
  }
}
