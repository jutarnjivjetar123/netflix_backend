import User from "../models/user.model/user.model";
import UserEmail from "../models/user.model/email.model";
import UserPassword from "../models/user.model/password.model";
import UserSalt from "../models/user.model/salt.model";
import UserPhoneNumber from "../models/user.model/phone.model";

import UserService from "../service/user.service/user.service";

import EncryptionHelpers from "../helpers/encryption.helper";

import { Request, Response, NextFunction } from "express";

export default class UserMiddleware {
  public async authenticateUserWithEmail(
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
      
      const isValid = 
  }
}
