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
import { resolveSoa } from "dns";

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
      const returnValue =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
      if (typeof returnValue !== "string") {
        return res.status(200).send({
          message: "Successfully parsed phone number",
          phoneNumber: returnValue.getNationalNumber().toString(),
          countryCode: returnValue.getCountryCode().toString(),
        });
      }
      return res.status(200).send({
        message: "Successfully parsed phone number",
        phoneNumber: returnValue,
        countryCode: null,
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        phoneNumber: null,
        countryCode: null,
      });
    }
  }

  private checkIsValidPhoneNumber(
    req: express.Request,
    res: express.Response
  ) {}

  private async createNewUserPhoneNumber(
    req: express.Request,
    res: express.Response
  ) {
    const { phoneNumber, password } = req.body;
  }

  private async getUsersByPhoneNumber(
    req: express.Request,
    res: express.Response
  ) {
    const { phoneNumber } = req.body;

    let parsedPhoneNumber;
    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        phoneNumber: null,
        countryCode: null,
      });
    }
    const nationalPhoneNumber =
      typeof parsedPhoneNumber === "string"
        ? parsedPhoneNumber
        : parsedPhoneNumber.getNationalNumber();
    const countryCode =
      typeof parsedPhoneNumber === "string"
        ? null
        : parsedPhoneNumber.getCountryCode();
    const usersWithPhoneNumber = await UserRepository.getUserByPhoneNumber(
      pa
    );
  }
}

export default new DevRouter().router;
