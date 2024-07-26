import { Request, Response, NextFunction } from "express";
import UserService from "../service/user.service/user.service";
import SessionRepository from "../repository/user.repository/session.repository";
import EncryptionHelpers from "../helpers/encryption.helper";
import SessionRepo from "../../.history/src/repository/user.repository/session.repository_20240710115711";
import JWTHelper from "../helpers/jwtokens.helpers";
import bcrypt from "bcrypt";

export default class SessionMiddleware {
  //Static function to check if the session token is valid
  public static async authenticateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}
  //Static function to generate new session and token
  public static async manageSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        successState: false,
        message: "No email was provided",
        timestamp: new Date(),
      });
    }
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        successState: false,
        message: "No user with email " + email + " was found",
        timestamp: new Date(),
      });
    }

    //get session by user
    const session = await SessionRepository.getSessionByUser(user);
    if (session) {
      const isSessionDeleted = await SessionRepository.deleteSession(session);
      if (!isSessionDeleted) {
        console.log(
          "[LOG - DATA] - " +
            new Date() +
            " - LOG::ERROR::SessionMiddleware::manageSession::isSessionDeleted::Failed to delete session for user with ID: " +
            user.userID +
            " and email: " +
            email +
            ", check SessionRepository logs for more detail"
        );
        return res.status(500).send({
          successState: false,
          message: "Could not login user",
          timestamp: new Date(),
        });
      }
    }
    const isSessionCreated = await SessionRepository.createSession(
      user,
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      req.ip,
      req.headers["user-agent"]
    );
    if (!isSessionCreated) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " - LOG::ERROR::SessionMiddleware::manageSession::isSessionCreated::Failed to create new session for user with ID: " +
          user.userID +
          " and email: " +
          email +
          ", check SessionRepository logs for more detail"
      );
      return res.status(500).send({
        successState: false,
        message: "Could not login user",
        timestamp: new Date(),
      });
    }
    //Create authentication token
    const tokenRefresh = await SessionRepository.refreshAuthenticationToken(
      isSessionCreated
    );
    if (!tokenRefresh) {
      console.log(
        "[LOG - DATA] - " +
          new Date() +
          " - LOG::ERROR::SessionMiddleware::manageSession::tokenRefresh::Failed to create token for session for user with ID: " +
          user.userID +
          " and email: " +
          email +
          ", check SessionRepository logs for more detail"
      );
      return res.status(500).send({
        successState: false,
        message: "Could not login user",
        timestamp: new Date(),
      });
    }
    next();
  }
}
