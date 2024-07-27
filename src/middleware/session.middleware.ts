import { Request, Response, NextFunction } from "express";
import UserService from "../service/user.service/user.service";
import SessionRepository from "../repository/user.repository/session.repository";
import EncryptionHelpers from "../helpers/encryption.helper";
import JWTHelper from "../helpers/jwtokens.helpers";

export default class SessionMiddleware {
  public static async manageSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const email = req.body.email;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        successState: false,
        message: "User not found",
        timestamp: new Date(),
      });
    }

    const oldSession = await SessionRepository.getSessionByUser(user);
    if (oldSession !== null) {
      if (!(await SessionRepository.deleteSession(oldSession))) {
        return res.status(500).send({
          successState: false,
          message: "Could not login user",
          timestamp: new Date(),
        });
      }
    }
    const session = await SessionRepository.createSession(user);
    if (!session) {
      return res.status(500).send({
        successState: false,
        message: "Could not login user",
        timestamp: new Date(),
      });
    }

    next();
  }
}
