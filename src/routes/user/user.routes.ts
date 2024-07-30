import express from "express";

import UserService from "../../service/user.service/user.service";
import UserMiddleware from "../../middleware/user.middleware";
import SessionMiddleware from "../../middleware/session.middleware";
import DataParserMiddleware from "../../middleware/parser.middleware";
import EncryptionHelpers from "../../helpers/encryption.helper";
import SessionRepository from "../../repository/user.repository/session.repository";
import JWTHelper from "../../helpers/jwtokens.helpers";
import { FaWineGlassEmpty } from "react-icons/fa6";
import UserSession from "models/user.model/session.model";

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
      SessionMiddleware.manageSession,
      this.login
    );
    this.router.post(
      "/protected",
      SessionMiddleware.authorizeUser,
      this.requestResource
    );
    this.router.post("/refresh-token", this.refreshAccessToken);
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
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        successState: false,
        message: "Email is required",
        timestamp: new Date(),
      });
    }
    if (!password) {
      return res.status(400).send({
        successState: false,
        message: "Password is required",
        timestamp: new Date(),
      });
    }
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        successState: false,
        message: "User not found",
        timestamp: new Date(),
      });
    }

    const session = await SessionRepository.getSessionByUser(user);
    const userSalt = await UserService.getUserSaltByUser(user);
    res.cookie("refresh-token", session.refreshToken);

    const accessToken = JWTHelper.generateToken(
      {
        userID: user.userID,
        email: email,
      },
      userSalt.salt,
      "8h"
    );
    res.cookie("Authorization", "Bearer " + accessToken);
    return res.status(200).send({
      successState: true,
      message: "Welcome back " + email,
      timestamp: new Date(),
    });
  }

  private async requestResource(req: express.Request, res: express.Response) {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(403).send({
        successState: false,
        message: "Invalid access token",
        timestamp: new Date(),
      });
    }

    console.log(authorization);
    const token = authorization.split(" ")[1];
    console.log(token);
    const decodedToken = JWTHelper.decodeToken(token);
    const tokenInString = JSON.stringify(decodedToken);
    console.log(JSON.parse(tokenInString));
    const email = JSON.parse(tokenInString).email;

    const user = await UserService.getUserByEmail(email);
    // if (!user) {
    //   return res.status(403).send({
    //     successState: false,
    //     message: "User with email " + email + " not found",
    //     timestamp: new Date(),
    //   });
    // }
    const session = await SessionRepository.getSessionByUser(user);
    // if (!session) {
    //   res.redirect("http://localhost:5051/login.html");
    //   return res.status(403).send({
    //     successState: false,
    //     message: "User with email " + email + " not logged in",
    //     timestamp: new Date(),
    //   });
    // }
    const userSalt = await UserService.getUserSaltByUser(user);
    // const validatedToken = JWTHelper.getValidToken(token, userSalt.salt);
    // if (
    //   validatedToken === "Token has expired" ||
    //   validatedToken === "Token is invalid" ||
    //   !validatedToken
    // ) {
    //   return res.status(403).send({
    //     successState: false,
    //     message: validatedToken,
    //     timestamp: new Date(),
    //   });
    // }
    const accessToken = JWTHelper.generateToken(
      {
        userID: user.userID,
        email: email,
      },
      userSalt.salt,
      "8h"
    );

    res.setHeader("Authorization", `Bearer ${accessToken}`);
    return res.status(200).send({
      successState: true,
      message: "Requested resource sent",
      data: {
        dogName: "Rex",
      },
      timestamp: new Date(),
    });
  }

  private async refreshAccessToken(
    req: express.Request,
    res: express.Response
  ) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(400).send({
        successState: false,
        message: "No refresh token was provided",
        timestamp: new Date(),
      });
    }

    const token = JWTHelper.decodeToken(authorization.split(" ")[1]);
    if (!token) {
      return res.status(401).send({
        successState: false,
        message: "Invalid refresh token",
        timestamp: new Date(),
      });
    }
    const tokenInJSON = JSON.parse(JSON.stringify(token));
    const userId = tokenInJSON.userID;

    const loginData = await SessionRepository.getLoginDataForUserByUserID(
      userId
    );
    console.log("Login data: " + JSON.stringify(loginData));
    const stringLoginData = JSON.stringify(loginData);
    const jsonData = JSON.parse(stringLoginData);
    console.log(jsonData[0]);
    console.log(jsonData[1]);
    console.log(jsonData[2]);
    console.log(jsonData[3]);
    const accessToken = JWTHelper.generateToken(
      {
        userID: jsonData[0].userID,
        email: jsonData[1].email,
      },
      jsonData[3].salt,
      "8h"
    );
    const newRefreshToken = SessionRepository.updateRefreshTokenByUserID(
      jsonData[0].userID,
      jsonData[3].salt
    );

    res.header("Authorization", "Bearer " + accessToken);
    res.header("Refresh-Token", "Bearer " + newRefreshToken);
    return res.status(200).send({
      successState: true,
      message: "Refreshed access token successfully",
      timestamp: new Date(),
    });
  }
}

export default new UserRouter().router;
