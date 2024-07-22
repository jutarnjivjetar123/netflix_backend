import express from "express";

import UserService from "../../service/user.service/user.service";
import DataSanitation from "../../helpers/sanitation.helpers";
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
    const { email, phoneNumber, password } = req.body;

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
    if (!email) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRouter::createUser::email::Missing email::Could not create new user::Returning 400"
      );
      return res.status(400).send({
        successState: false,
        message: "Email is required",
        timestamp: new Date(),
      });
    }
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
}

export default new UserRouter().router;
