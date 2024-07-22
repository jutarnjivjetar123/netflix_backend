import express from "express";

import DataSanitation from "../../helpers/sanitation.helpers";
import {
  PhoneNumberHelper,
  PhoneNumberObject,
} from "../../helpers/phoneNumber.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import User from "../../models/user.model/user.model";
import UserService from "../../service/user.service/user.service";
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
}

export default new UserRouter().router;
