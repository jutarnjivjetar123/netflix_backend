import express from "express";

import UserService from "../../service/user.service/user.service";
import DataSanitation from "../../helpers/sanitation.helpers";
import PhoneNumberHelper from "helpers/phoneNumber.helpers";
class UserRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", this.createUser);
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
      const parsedPhoneNumber = PhoneNumberHelper.parsePhoneNumber(phoneNumber);
      if (
        !PhoneNumberHelper.validatePhoneNumberFromPhoneNumberType(
          parsedPhoneNumber
        )
      ) {
        console.log(
          new Date() +
            " -> LOG::Error::UserService::createAndValidateNewUserByPhoneNumber::Not phone number::Could not create new user"
        );
        return res.status(400).send({
          successState: false,
          message: "Phone number invalid",
          userData: {
            phoneNumber: phoneNumber,
          },
          timestamp: new Date(),
        });
      }
      const doesUserExist =
        await UserService.checkIfUserExistsWithPhoneNumber();

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
}

export default new UserRouter().router;
