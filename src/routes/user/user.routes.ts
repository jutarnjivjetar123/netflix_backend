import express from "express";

import UserService from "../../service/user.service/user.service";
import UserMiddleware from "../../middleware/user.middleware";
import SessionMiddleware from "../../middleware/session.middleware";
import DataParserMiddleware from "../../middleware/parser.middleware";
import SessionRepository from "../../repository/user.repository/session.repository";
import JWTHelper from "../../helpers/jwtokens.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import { count } from "console";
import EncryptionHelpers from "../../helpers/encryption.helper";

class UserRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", this.registerUser);
    this.router.post("/login", this.login);
    this.router.post(
      "/protected",
      SessionMiddleware.checkAuthorization,
      this.getProtectedData
    );
    this.router.post(
      "/dashboard",
      SessionMiddleware.checkAuthorization,
      this.getDashboardData
    );
  }

  private async registerUser(req: express.Request, res: express.Response) {
    const {
      email,
      phoneNumber,
      countryCode,
      password,
      username,
      firstName,
      lastName,
    } = req.body;
    if (!email && !phoneNumber) {
      return res.status(400).send({
        successState: false,
        message: "No email od phone number was provided",
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

    if (email && !phoneNumber) {
      try {
        const newUser = await UserService.registerUserWithEmail(
          email,
          password,
          firstName,
          lastName,
          username
        );
        if (!newUser) {
          return res.status(400).send({
            successState: false,
            message: "Error occurred whilst registering a new user",
            timestamp: new Date(),
          });
        }
      } catch (error) {
        return res.status(400).send({
          successState: false,
          message: error.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        successState: true,
        message: "User with email " + email + " was successfully registered",
        timestamp: new Date(),
      });
    }
    if (phoneNumber && !email) {
      if (!countryCode) {
        return res.status(400).send({
          successState: false,
          message: "Country code must be provided",
          timestamp: new Date(),
        });
      }
      try {
        const newUser = await UserService.registerUserWithPhoneNumber(
          phoneNumber,
          countryCode,
          password,
          firstName,
          lastName,
          username
        );
        if (!newUser) {
          return res.status(400).send({
            successState: false,
            message: "Error occurred whilst registering a new user",
            timestamp: new Date(),
          });
        }
      } catch (error) {
        return res.status(400).send({
          successState: false,
          message: error.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        successState: true,
        message:
          "User with phone number " +
          phoneNumber +
          " was successfully registered",
        timestamp: new Date(),
      });
    }
  }

  // private async loginUser(req: express.Request, res: express.Response) {
  //   const { phoneNumber, email, password } = req.body;
  //   if (!phoneNumber && !email) {
  //     return res.status(400).send({
  //       successState: false,
  //       message: "Phone number or email must be provided to login",
  //       timestamp: new Date(),
  //     });
  //   }

  //   if (!password) {
  //     return res.status(400).send({
  //       successState: false,
  //       message: "Password was not provided",
  //       timestamp: new Date(),
  //     });
  //   }

  //   if ((email && !phoneNumber) || (email && phoneNumber)) {
  //     const loginResult = await UserService.loginUserWithEmail(
  //       email,
  //       req.ip,
  //       req.headers["user-agent"] ? req.headers["user-agent"] : ""
  //     );
  //     if (!loginResult.returnValue) {
  //       return res.status(400).send({
  //         successState: false,
  //         message: loginResult.message,
  //         timestamp: new Date(),
  //       });
  //     }
  //     const userSalt = await UserService.getUserSaltByUser(
  //       loginResult.returnValue.user
  //     );
  //     const token = await JWTHelper.generateToken(
  //       {
  //         token: loginResult.returnValue.session.authToken,
  //         email: email,
  //         id: EncryptionHelpers.generateSalt(12),
  //       },
  //       userSalt.salt
  //     );

  //     res.cookie("Authentication", `Bearer ${token}`);
  //     return res.status(200).send({
  //       successState: true,
  //       message: loginResult.message,
  //       data: {
  //         redirectLink: "http://localhost:5501/src/dashboard.html",
  //         user: {
  //           userId: loginResult.returnValue.user.userID,
  //           username: loginResult.returnValue.user.username,
  //           firstName: loginResult.returnValue.user.firstName,
  //           lastName: loginResult.returnValue.user.lastName,
  //         },
  //         email: {
  //           email: email,
  //         },
  //       },
  //     });
  //   }
  //   const doesUserExist =
  //     await UserService.checkDoesUserExistWithPhoneNumber_WithParsing(
  //       phoneNumber
  //     );
  //   if (typeof doesUserExist.returnValue !== "boolean") {
  //     return res.status(400).send({
  //       successState: false,
  //       message: "Error occured, could not log in user, try again later",
  //       timestamp: new Date(),
  //     });
  //   }
  //   if (!doesUserExist.returnValue) {
  //     return res.status(404).send({
  //       successState: false,
  //       message:
  //         "User with phone number " +
  //         phoneNumber +
  //         " does not exist, instead sign up on Netflix with your credentials, //must reroute to register page",
  //       timestamp: new Date(),
  //     });
  //   }

  //   const loginResult = await UserService.loginUserWithPhoneNumber(
  //     phoneNumber,
  //     req.ip,
  //     req.headers["user-agent"]
  //   );
  //   if (!loginResult.returnValue) {
  //     return res.status(400).send({
  //       successState: false,
  //       message: loginResult.message,
  //       timestamp: new Date(),
  //     });
  //   }
  //   res.cookie(
  //     "Authorization",
  //     "Bearer" + loginResult.returnValue.session.authToken
  //   );
  //   return res.status(200).send({
  //     successState: true,
  //     message: loginResult.message,
  //     data: {
  //       user: {
  //         userId: loginResult.returnValue.user.userID,
  //         username: loginResult.returnValue.user.username,
  //         firstName: loginResult.returnValue.user.firstName,
  //         lastName: loginResult.returnValue.user.lastName,
  //       },
  //     },
  //   });
  // }

  //Function to retrieve dashboard data, for user based on the data from authentication token provided inside the request
  //Extracts token, reviews if it is valid, if it is updates the token value, extracts userId from token, and checks database for active user session, and returns session, checks if the provided session ID inside the token is valid, if it is, returns neccessary data for dashboard (dashboard data is personalized for every user based on their watching needs)

  private async login(req: express.Request, res: express.Response) {
    const { email, phoneNumber, countryCode, password } = req.body;
    if (!email && !phoneNumber && !countryCode) {
      return res.status(400).send({
        successState: false,
        message: "No email or phone number was provided",
        timestamp: new Date(),
      });
    }
    if (phoneNumber && !countryCode) {
      return res.status(400).send({
        successState: false,
        message: "Country code must be provided",
        timestamp: new Date(),
      });
    }
    if (email && !phoneNumber) {
      let loginResult;
      try {
        loginResult = await UserService.loginUserWithEmail(email, password);
      } catch (error) {
        return res.status(404).send({
          successState: false,
          message: error.message,
          timestamp: new Date(),
        });
      }
      console.log(
        "Session ID using email login: " + loginResult.session.sessionID
      );
      const token = JWTHelper.generateToken(
        {
          sessionID: loginResult.session.sessionID,
          id: await EncryptionHelpers.generateSalt(12),
        },
        loginResult.salt.salt
      );
      res.header("Authorization", "Bearer " + token);
      res.header("Refresh-Token", "Bearer " + loginResult.session.refreshToken);
      return res.status(200).send({
        successState: true,
        message: "Welcome back, " + email,

        data: {
          redirectLink: "http://localhost:5501/src/dashboard.html",
        },

        timestamp: new Date(),
      });
    }
    if (phoneNumber && countryCode && !email) {
      let loginResult;
      try {
        loginResult = await UserService.loginUserWithPhoneNumber(
          phoneNumber,
          countryCode,
          password
        );
      } catch (error) {
        return res.status(400).send({
          successState: false,
          message: error.message,
          timestamp: new Date(),
        });
      }
      console.log(
        "LOG from UserRouter, session: " +
          JSON.stringify(loginResult.session.sessionID)
      );
      const token = JWTHelper.generateToken(
        {
          sessionId: loginResult.session.sessionID,
          id: await EncryptionHelpers.generateSalt(12),
        },
        loginResult.salt.salt
      );

      res.header("Authorization", "Bearer " + token);
      res.header("Refresh-Token", "Bearer " + loginResult.session.refreshToken);
      return res.status(200).send({
        successState: true,
        message: "Welcome back, " + phoneNumber,
        data: {
          redirectLink: "http://localhost:5501/src/dashboard.html",
        },
        timestamp: new Date(),
      });
    }
  }
  private async getProtectedData(req: express.Request, res: express.Response) {
    return res.status(200).send({
      successState: true,
      message: "The protected data",
      timestamp: new Date(),
    });
  }

  private async getDashboardData(req: express.Request, res: express.Response) {
    const authSessionId = req.headers.authorization;
    console.log(authSessionId);
    const decodedToken = JWTHelper.decodeToken(authSessionId.split(" ")[1]);
    console.log(JSON.parse(JSON.stringify(decodedToken)));
    const decodedTokenInJSON = JSON.parse(JSON.stringify(decodedToken));
    const sessionId = decodedTokenInJSON.sessionID;
    console.log(sessionId);
    await SessionRepository.getLoginDataBySessionID(sessionId);
    return res.status(200).send({
      successState: true,
      message: "Dashboard data",
      timestamp: new Date(),
    });
  }
}

export default new UserRouter().router;
