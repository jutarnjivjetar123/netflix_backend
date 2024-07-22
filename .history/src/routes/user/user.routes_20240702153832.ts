import express from "express";

import UserService from "../../service/user.service/user.service";
import DataSanitation from "../../helpers/sanitation.helpers";
import {
  PhoneNumberHelper,
  PhoneNumberObject,
} from "../../helpers/phoneNumber.helpers";

class UserRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", this.createUser);
    this.router.post("/login", this.loginUser);
  }

  private async createUser(req: express.Request, res: express.Response) {
    const { email, phoneNumber, password, firstName, lastName } = req.body;

    if (!password) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRouter::createUser::password::Missing password::Could not create new user::Returning 400"
      );
      return res.status(400).send({
        successState: false,
        message: "Password is required",
        timestamp: new Date(),
      });
    }
    if (!email && !phoneNumber) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRouter::createUser::email - phoneNumber::Missing email and phoneNumber::Could not create new user::Returning 400"
      );
      return res.status(400).send({
        successState: false,
        message: "Phone number or email is required",
        timestamp: new Date(),
      });
    }

    if (email && !phoneNumber) {
      const sanitizedEmail = DataSanitation.sanitizeEmail(email);
      const doesUserExist = await UserService.checkIfUserExistsWithEmail(
        sanitizedEmail
      );
      if (doesUserExist) {
        console.log(
          new Date() +
            " -> LOG::Error::UserRouter::createUser::doesUserExist::User with email exists::Returning 400"
        );
        return res.status(400).send({
          successState: false,
          message: "User with email " + sanitizedEmail + " exists",
          timestamp: new Date(),
        });
      }
      const newUser = await UserService.createAndValidateNewUserByEmail(
        sanitizedEmail,
        password,
        firstName,
        lastName
      );

      if (!newUser) {
        console.log(
          new Date() +
            " -> LOG::Error::UserRouter::createUser::newUser::Could not create new user::Returning 400"
        );
        return res.status(400).send({
          successState: false,
          message: "Could not create new user",
          timestamp: new Date(),
        });
      }

      console.log(
        new Date() +
          " -> LOG::Success::UserRouter::createUser::newUser::Created new user::Returning 200"
      );
      return res.status(200).send({
        successState: true,
        message: "Created new user",
        userData: {
          username: newUser.username,
        },
        timestamp: new Date(),
      });
    }

    if (phoneNumber && !email) {
      let parsedPhoneNumber: PhoneNumberObject;
      try {
        parsedPhoneNumber = PhoneNumberHelper.parsePhoneNumber(phoneNumber);
      } catch (error) {
        console.log(
          new Date() +
            " -> LOG::Error::UserService::createAndValidateNewUserByPhoneNumber:: " +
            error +
            "::Could not create new user"
        );
        return res.status(400).send({
          successState: false,
          message: error,
          timestamp: new Date(),
        });
      }
      if (
        !PhoneNumberHelper.validatePhoneNumberFromStringNOTSAFE(phoneNumber)
      ) {
        console.log(
          new Date() +
            " -> LOG::Error::UserService::createAndValidateNewUserByPhoneNumber::Not phone number::Could not create new user"
        );
        return res.status(400).send({
          successState: false,
          message: "Phone number invalid",
          timestamp: new Date(),
        });
      }
      const doesUserExist = await UserService.checkIfUserExistsWithPhoneNumber(
        parsedPhoneNumber.phoneNumber,
        parsedPhoneNumber.countryCode
      );
      if (doesUserExist) {
        console.log(
          new Date() +
            " -> LOG::Error::UserRouter::createUser::doesUserExist::User with phone number exists::Returning 400"
        );
        return res.status(400).send({
          successState: false,
          message:
            "User with phone number " +
            phoneNumber +
            " and national calling number: " +
            parsedPhoneNumber.countryCode +
            " exists",
          timestamp: new Date(),
        });
      }
      const newUser = await UserService.createAndValidateNewUserByPhoneNumber(
        phoneNumber,
        password,
        firstName,
        lastName
      );

      if (!newUser) {
        console.log(
          new Date() +
            " -> LOG::Error::UserRouter::createUser::newUser::Could not create new user::Returning 400"
        );
        return res.status(400).send({
          successState: false,
          message: "Could not create new user",
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        successState: true,
        message: "Created new user",
        userData: {
          phoneNumber: phoneNumber,
        },
        timestamp: new Date(),
      });
    }
  }

  private async loginUser(req: express.Request, res: express.Response) {
    const { email, phoneNumber, password } = req.body;
    if (!email && !phoneNumber) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRouter::loginUser::email && phoneNumber::Missing values::Could not login user::Returning 400"
      );
      return res.status(400).send({
        successState: false,
        message: "Email or phone number is required",
        timestamp: new Date(),
      });
    }
    if (!password) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRouter::loginUser::password::Missing password::Could not login user::Returning 400"
      );
      return res.status(400).send({
        successState: false,
        message: "Password is required",
        timestamp: new Date(),
      });
    }

    if (email && !phoneNumber) {

      const sanitizedEmail = DataSanitation.sanitizeEmail(email);
      const doesUserExist = await UserService.checkIfUserExistsWithEmail(
        sanitizedEmail
      );
      if (!doesUserExist) { 
        console.log(
          new Date() +
            " -> LOG::Error::UserRouter::loginUser::doesUserExist::Missing password::Could not login user::Returning 400"
        );
        return res.status(400).send({
          successState: false,
          message: "Password is required",
          timestamp: new Date(),
        });
      }
    }
  }
}

export default new UserRouter().router;
