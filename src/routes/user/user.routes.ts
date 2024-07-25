import express from "express";

import UserService from "../../service/user.service/user.service";
import UserMiddleware from "../../middleware/user.middleware";
import DataParserMiddleware from "../../middleware/parser.middleware";
import EncryptionHelpers from "helpers/encryption.helper";
import JWTHelper from "../../helpers/jwtokens.helpers";
import { timeStamp } from "console";
import UserRepository from "../../repository/user.repository/user.repository";
import SessionRepository from "../../repository/user.repository/session.repository";
import SessionService from "../../service/user.service/session.service";
class UserRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", this.registerUser);
    this.router.post(
      "/login",
      DataParserMiddleware.conditionalParser,
      UserMiddleware.conditionalAuthentication,
      this.loginUser
    );
  }

  private async registerUser(req: express.Request, res: express.Response) {
    const { email, phoneNumber, password, firstName, lastName, username } =
      req.body;

    if (email && !phoneNumber) {
      const doesUserExist = await UserService.checkDoesUserExistWithEmail(
        email
      );
      if (doesUserExist.returnValue) {
        return res.status(400).send({
          successState: false,
          message: "Email " + email + " taken",
          timestamp: new Date(),
        });
      }

      const newUser = await UserService.registerUserByEmail(
        firstName,
        lastName,
        username,
        email,
        password
      );

      if (!newUser.returnValue) {
        return res.status(400).send({
          successState: false,
          message: newUser.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        successState: true,
        message: "Successfully created new user with email: " + email,
        returnData: {},

        timestamp: new Date(),
      });
    }

    if (phoneNumber && !email) {
      //function to check does user with given phone number exist

      console.log(
        new Date() +
          " -> UserRoutes::registerUser::phoneNumber parameter has value of: " +
          phoneNumber +
          " and type: " +
          typeof phoneNumber
      );

      const newUser = await UserService.registerUserWithPhoneNumber(
        firstName,
        lastName,
        username,
        phoneNumber,
        password
      );
      if (!newUser.returnValue) {
        return res.status(400).send({
          successState: false,
          message: newUser.message,
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        successState: true,
        message:
          "Successfully created new user with phone number: " + phoneNumber,
        returnData: {
          user: {
            username: newUser.returnValue.user.username,
            firstName: newUser.returnValue.user.firstName,
            lastName: newUser.returnValue.user.lastName,
            phoneNumber: newUser.returnValue.phoneNumber.phoneNumber,
          },
        },
        timestamp: new Date(),
      });
    }

    if (!email && !phoneNumber) {
      return res.status(400).send({
        successState: false,
        message: "Values supplied are empty",
        timestamp: new Date(),
      });
    }
  }

  private async loginUser(req: express.Request, res: express.Response) {
    const { phoneNumber, email, password } = req.body;
    if (!phoneNumber && !email) {
      return res.status(400).send({
        successState: false,
        message: "Phone number or email must be provided to login",
        timestamp: new Date(),
      });
    }

    if (!password) {
      return res.status(400).send({
        successState: false,
        message: "Password was not provided",
        timestamp: new Date(),
      });
    }

    if ((email && !phoneNumber) || (email && phoneNumber)) {
      const loginResult = await UserService.loginUserWithEmail(
        email,
        req.ip,
        req.headers["user-agent"] ? req.headers["user-agent"] : ""
      );
      if (!loginResult.returnValue) {
        return res.status(400).send({
          successState: false,
          message: loginResult.message,
          timestamp: new Date(),
        });
      }

      // const jwtTokenToReturn = JWTHelper.generateToken(
      //   {
      //     data: email,
      //     id: loginResult.returnValue.session.sessionID,
      //   },
      //   loginResult.returnValue.session.authToken
      // );
      // console.log("JWT: " + jwtTokenToReturn);
      // console.log(
      //   "JWT decoded: " +
      //     JSON.stringify(JWTHelper.decodeToken(jwtTokenToReturn))
      // );
      // res.cookie("Authorization", "Bearer " + jwtTokenToReturn);

      return res.status(200).send({
        successState: true,
        message: loginResult.message,
        data: {
          redirectLink: "http://localhost:5501/src/dashboard.html",
          user: {
            userId: loginResult.returnValue.user.userID,
            username: loginResult.returnValue.user.username,
            firstName: loginResult.returnValue.user.firstName,
            lastName: loginResult.returnValue.user.lastName,
          },
          email: {
            email: email,
          },
          // session: {
          //   sessionID: loginResult.returnValue.session.sessionID,
          //   authToken: loginResult.returnValue.session.authToken,
          //   expiresAt: loginResult.returnValue.session.expiresAt,
          // },
        },
      });
    }
    const doesUserExist =
      await UserService.checkDoesUserExistWithPhoneNumber_WithParsing(
        phoneNumber
      );
    if (typeof doesUserExist.returnValue !== "boolean") {
      return res.status(400).send({
        successState: false,
        message: "Error occured, could not log in user, try again later",
        timestamp: new Date(),
      });
    }
    if (!doesUserExist.returnValue) {
      return res.status(404).send({
        successState: false,
        message:
          "User with phone number " +
          phoneNumber +
          " does not exist, instead sign up on Netflix with your credentials, //must reroute to register page",
        timestamp: new Date(),
      });
    }

    const loginResult = await UserService.loginUserWithPhoneNumber(
      phoneNumber,
      req.ip,
      req.headers["user-agent"]
    );
    if (!loginResult.returnValue) {
      return res.status(400).send({
        successState: false,
        message: loginResult.message,
        timestamp: new Date(),
      });
    }
    res.cookie("authToken", loginResult.returnValue.session.authToken);

    return res.status(200).send({
      successState: true,
      message: loginResult.message,
      data: {
        user: {
          userId: loginResult.returnValue.user.userID,
          username: loginResult.returnValue.user.username,
          firstName: loginResult.returnValue.user.firstName,
          lastName: loginResult.returnValue.user.lastName,
        },
        session: {
          sessionID: loginResult.returnValue.session.sessionID,
          authToken: loginResult.returnValue.session.authToken,
          expiresAt: loginResult.returnValue.session.expiresAt,
        },
      },
    });
  }

  //Function to retrieve dashboard data, for user based on the data from authentication token provided inside the request
  //Extracts token, reviews if it is valid, if it is updates the token value, extracts userId from token, and checks database for active user session, and returns session, checks if the provided session ID inside the token is valid, if it is, returns neccessary data for dashboard (dashboard data is personalized for every user based on their watching needs)
}

export default new UserRouter().router;
