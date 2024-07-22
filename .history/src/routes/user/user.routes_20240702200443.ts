import express from "express";

import UserService from "../../service/user.service/user.service";
import DataSanitation from "../../helpers/sanitation.helpers";
import {
  PhoneNumberHelper,
  PhoneNumberObject,
} from "../../helpers/phoneNumber.helpers";
import UserRepository from "../../repository/user.repository/user.repository";
import User from "../../models/user.model/user.model";

class UserRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/register", this.registerUserByEmail);
  }

  private async registerUserByEmail(
    req: express.Request,
    res: express.Response
  ) {
    const { email, password, firstName, lastName, username } = req.body;
    if (!email) {
      return;
    }
  }
}

export default new UserRouter().router;
