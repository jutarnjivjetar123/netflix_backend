import * as express from "express";
import UserService from "../service/user.service/user.service";
import UserRepository from "../repository/user.repository/user.repository";
import SessionRepository from "../repository/user.repository/session.repository";
import EncryptionHelpers from "../helpers/encryption.helper";
import JWTHelper from "../helpers/jwtokens.helpers";

export default class SessionMiddleware {
  public static async checkAuthorization(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
      console.log("AUTH error");
      return res.status(403).send({
        successState: false,
        message: "Invalid token",
        timestamp: new Date(),
      });
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    const decodedToken = JWTHelper.decodeToken(accessToken);
    const decodedTokenInJSON = JSON.parse(JSON.stringify(decodedToken));
    if (!decodedTokenInJSON) {
      console.log("Token decode ERROR");
      return res.status(403).send({
        successState: false,
        message: "Invalid token",
        timestamp: new Date(),
      });
    }
    if (
      !decodedTokenInJSON.hasOwnProperty("sessionID") ||
      !decodedTokenInJSON.hasOwnProperty("id")
    ) {
      console.log("Missing property error");
      return res.status(403).send({
        successState: false,
        message: "Invalid token",
        timestamp: new Date(),
      });
    }
    const saltAndSession =
      await UserRepository.getSaltAndSessionObjectBySessionID(
        decodedTokenInJSON.sessionID
      );
    console.log(saltAndSession);
    const saltObject = saltAndSession.salt;
    const sessionObject = saltAndSession.session;
    console.log(sessionObject);
    console.log(saltObject);
    if (!saltAndSession) {
      return res.status(404).send({
        successState: false,
        message: "User not found",
        timestamp: new Date(),
      });
    }
    if (!sessionObject) {
      return res.status(403).send({
        successState: false,
        message: "User not logged in",
        redirectLink: "http://localhost:5001/login.html",
        timestamp: new Date(),
      });
    }
    if (sessionObject.expiresAt < new Date()) {
      return res.status(403).send({
        successState: false,
        message: "User not logged in",
        redirectLink: "http://localhost:5001/login.html",
        timestamp: new Date(),
      });
    }

    const tokenValidation = JWTHelper.getValidToken(
      accessToken,
      saltObject.salt
    );
    console.log(tokenValidation);
    if (tokenValidation === typeof "string") {
      return res.status(403).send({
        successState: false,
        message: tokenValidation,
        timestamp: new Date(),
      });
    }

    console.log("Access token is valid, granted access to user");
    next();
  }
}
