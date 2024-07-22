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

class DevRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/getPhoneNum", this.checkUserPhoneNumber);
    this.router.post("/register", this.createNewUserPhoneNumber);
  }

  private async checkUserPhoneNumber(
    req: express.Request,
    res: express.Response
  ) {
    const { phoneNumber } = req.body;

    try {
      
      const returnValue = PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    }
    catch (error)}{
  
    }
  }

  private async createNewUserPhoneNumber(
    req: express.Request,
    res: express.Response
  ) {
    const { phoneNumber, password } = req.body;
  }
}

export default new DevRouter().router;
