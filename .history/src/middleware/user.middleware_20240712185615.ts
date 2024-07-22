import User from "../models/user.model/user.model";
import UserEmail from "../models/user.model/email.model";
import UserPassword from "../models/user.model/password.model";
import UserSalt from "../models/user.model/salt.model";
import UserPhoneNumber from "../models/user.model/phone.model";

import UserService from "../service/user.service/user.service";

import EncryptionHelpers from "../helpers/encryption.helper";

import { Request, Response, NextFunction } from "express";
import UserRepository from "repository/user.repository/user.repository";
import { PhoneNumberHelper } from "helpers/phoneNumber.helpers";

export default class UserMiddleware {
  public static conditionalAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, phoneNumber } = req.body;
    if (email && !phoneNumber) {
      UserMiddleware.authenticateUserWithEmail(req, res, next);
    }
    if (phoneNumber && !email) {
      return UserMiddleware.authenticateUserWithPhoneNumber(req, res, next);
    }
    if (email && phoneNumber) {
      UserMiddleware.authenticateUserWithEmail(req, res, next);
    }
    if (!email && !phoneNumber) {
      return res.status(400).send({
        successState: false,
        message: "Email or phone number must be provided to login",
        timestamp: new Date(),
      });
    }
  }
  public static async authenticateUserWithEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, password } = req.body;
    const doesUserExist = await UserService.checkDoesUserExistWithEmail(email);
    if (!doesUserExist.returnValue) {
      return res.status(404).send({
        successState: false,
        message: "User with email address " + email + " does not exist",
        timestamp: new Date(),
      });
    }
    const userToLogin = await UserService.getUserByEmail(email);
    if (!userToLogin) {
      return res.status(404).send({
        successState: false,
        message: "User with email address " + email + " does not exist",
        timestamp: new Date(),
      });
    }
    const userPassword = await UserService.getUserPasswordByUser(userToLogin);
    if (!userPassword) {
      return res.status(400).send({
        successState: false,
        message:
          "Error processing login request failed, please try again later",
        timestamp: new Date(),
      });
    }

    const isValid = await EncryptionHelpers.validatePassword(
      password,
      userPassword.hash
    );
    if (!isValid) {
      return res.status(401).send({
        successState: false,
        message: "Password is incorrect",
        timestamp: new Date(),
      });
    }
    next();
  }

  public static async authenticateUserWithPhoneNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { phoneNumber, password } = req.body;
    const phoneNumberParsingResult =
      PhoneNumberHelper.getNationalNumberAndCountryCodeFromPhoneNumber(
        phoneNumber
      );
    if (!phoneNumberParsingResult.returnValue) {
      return res.status(400).send({
        successState: false,
        message: phoneNumberParsingResult.message,
        timestamp: new Date(),
      });
    }
    let nationalPhoneNumber =
      phoneNumberParsingResult.returnValue.nationalPhoneNumber;
    let countryCode =
      phoneNumberParsingResult.returnValue.countryCodeForPhoneNumber;
    const doesUserExist = await UserRepository.getUserByPhoneNumber(nationalPhoneNumber, countryCode);
    if (!doesUserExist) { 
      return res.status(404).send({
        successState: false,
        message: "User with phone number " + pho
      })
    }
  }
}
