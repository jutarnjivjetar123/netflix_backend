import { Request, Response, NextFunction } from "express";
import SessionService from "../service/user.service/session.service";
import UserService from "../service/user.service/user.service";

export default class SessionMiddleware {
  public static async authenticateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email } = req.body;
    if (!email)
      return res.status(400).send({
        successState: false,
        message: "Email is missing",
        timestamp: new Date(),
      });

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        successState: false,
        message: "User with email " + email + " not found",
        timestamp: new Date(),
      });
    }

    const activeSession = await SessionService.getSessionByUser(user);

    if (!activeSession) {
      return res.status(403).send({
        successState: false,
        message: "User with email " + email + " is not logged in",
        timestamp: new Date(),
      });
    }
    let newSession;

    if (activeSession.expiresAt > new Date()) {
      newSession = await SessionService.extendSessionExpiryTime(activeSession);
    }
    if (activeSession.expiresAt < new Date()) {
      const isSessionDeleted = await SessionService.deleteSessionByUser(user);
      if (!isSessionDeleted) {
        return res.status(500).send({
          successState: false,
          message:
            "Currently user with email " + email + " cannot be logged in",
          timestamp: new Date(),
        });
      }

      newSession = await SessionService.createNewSession(
        user,
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        req.ip,
        req.headers["user-agent"],
        ""
      );
      if (!newSession) {
        return res.status(500).send({
          successState: false,
          message:
            "Currently user with email " + email + " cannot be logged in",
          timestamp: new Date(),
        });
      }
    }

    next();
  }
}
