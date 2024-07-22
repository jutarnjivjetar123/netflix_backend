import express from "express";

import DataSanitation from "../../helpers/sanitation.helpers";
import {
  PhoneNumberHelper,
  PhoneNumberObject,
} from "../../helpers/phoneNumber.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import User from "../../models/user.model/user.model";
import EncryptionHelpers from "helpers/encryption.helper";

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
    const { email, password, firstName, lastName, username } = req.body;
    if (!email) {
      return res.status(401).send({
        successState: false,
        message: "Email not provided",
        timestamp: new Date(),
      });
    }
    if (!password) {
      return res.status(401).send({
        successState: false,
        message: "Password not provided",
        timestamp: new Date(),
      });
    }

    const newUser = await UserRepository.createNewUserByEmail(
      firstName,
      lastName,
      username,
      true
    );

    if (!newUser) {
      return res.status(400).send({
        successState: false,
        message: "Could not create new user with email: " + email,
        timestamp: new Date(),
      });
    }

    const newEmail = await UserRepository.createNewUserEmail(email, newUser);

    if (!newEmail) {
      return res.status(400).send({
        successState: false,
        message: "Could not create new user with email: " + email,
        timestamp: new Date(),
      });
    }
    
      const passwordHash = await EncryptionHelpers.hashPassword()
    const newPassword = await UserRepository.createUserPassword()
    return res.status(200).send({
      successState: false,
      message: "New user was created, email: " + email,
      userData: {
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      emailData: {
        email: newEmail.email,
        newEmailUser: newEmail.user,
      },
      timestamp: new Date(),
    });
  }
}

export default new UserRouter().router;
