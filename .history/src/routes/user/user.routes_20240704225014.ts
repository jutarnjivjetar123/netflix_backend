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

    const doesUserExist = await UserService.checkDoesUserExistWithEmail(email);
    if (doesUserExist.returnValue) {
      return res.status(400).send({
        successState: false,
        message: "Email " + email + " taken",
        timestamp: new Date(),
      });
    }

    const newUser = await UserService.createNewUserByEmail()

    
  }
}

export default new UserRouter().router;
