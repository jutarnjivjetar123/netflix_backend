import User from "../models/user.model/user.model";
import UserSession from "../models/user.model/session.model";

import SessionService from "../service/user.service/session.service";

export default class SessionManager {
  public static async setSessionForUser(
    userToSetSessionFor: User,
    originIpAddress: string,
    userAgent: string
  ) {
    
    if (!(await SessionService.getSessionByUser(userToSetSessionFor))) {
      const newSession = await SessionService.createNewSession(
        userToSetSessionFor,
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        originIpAddress,
        userAgent
      );
      if (!newSession.sessionID) return null;
      return newSession;
    }

    if (!(await SessionService.isSessionActiveForUser(
      userToSetSessionFor
    ))) {

        await SessionService.deleteSessionForUser_WithActiveSessionChecking(
          userToSetSessionFor
        ).then(() => { }).catch((error) => { 
          console.log("[LOG-DATA] - " + new Date() + " -> LOG::Info::")
        });

      const newSession = await SessionService.createNewSession(
        userToSetSessionFor,
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        originIpAddress,
        userAgent
      );
      if (!newSession.sessionID) return null;
      return newSession;
    }
    const extendedLifespanSession =
      await SessionService.extendSessionLifespanByUser(userToSetSessionFor);
    if (!extendedLifespanSession.sessionID) return null;
    return extendedLifespanSession;
  }
}
