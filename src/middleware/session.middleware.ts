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

  public static async authorizeUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.headers.authorization;
    if (!authorization || authorization.length < 1) {
      return res.status(403).send({
        successState: false,
        message: "Invalid access token",
        timestamp: new Date(),
      });
    }

    const token: string = authorization.split(" ")[1];
    const decodedToken = JWTHelper.decodeToken(token);
    if (!decodedToken) {
      return res.status(403).send({
        successState: false,
        message: "Invalid access token",
        timestamp: new Date(),
      });
    }
    const tokenInJSON = JSON.parse(JSON.stringify(token));
    const userId = tokenInJSON.userID;
    const loginData = await SessionRepository.getLoginDataForUserByUserID(
      userId
    );
    if (!loginData) {
      return res.status(403).send({
        successState: false,
        message: "User not logged in",
        redirectLink: "http://localhost:5051/login.html",
        timestamp: new Date(),
      });
    }
    console.log("Login data: " + JSON.stringify(loginData));
    const stringLoginData = JSON.stringify(loginData);
    const jsonLoginData = JSON.parse(stringLoginData);
    console.log(jsonLoginData[0]);
    console.log(jsonLoginData[1]);
    console.log(jsonLoginData[2]);
    console.log(jsonLoginData[3]);
    const validatedToken = JWTHelper.getValidToken(
      token,
      jsonLoginData[3].salt
    );
    if (
      validatedToken === "Token has expired" ||
      validatedToken === "Token is invalid" ||
      !validatedToken
    ) {
      return res.status(403).send({
        successState: false,
        message: validatedToken,
        timestamp: new Date(),
      });
    }

    next();
  }
}
