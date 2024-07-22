import express from "express";

import DataSanitation from "../../helpers/sanitation.helpers";
import {
  PhoneNumberHelper,
  PhoneNumberObject,
} from "../../helpers/phoneNumber.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import User from "../../models/user.model/user.model";
import UserService from "../../service/user.service/user.service";
import SessionService from "../../service/user.service/session.service";
import EncryptionHelpers from "../../helpers/encryption.helper";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

class UserRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", this.registerUser);
    this.router.post("/login", this.loginUser);
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
    const doesUserExist = phoneNumber
      ? await UserService.checkDoesUserExistWithPhoneNumber_WithParsing(
          phoneNumber
        )
      : await UserService.checkDoesUserExistWithEmail(email);
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
          "User with email " +
          email +
          " does not exist, instead sign up on Netflix with your credentials, //must reroute to register page",
        timestamp: new Date(),
      });
    }

    const loginResult = await UserService.loginUserWithEmail(
      email,
      password,
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
    return res.status(200).send({
      successState: true,
      message: loginResult.message,
      data: {
        user: {
          
        }
      }
    })
  }
}

export default new UserRouter().router;
