import express from "express";

import User from "models/user.model/email.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserHash from "models/user.model/hash.model";
import UserVerificationToken from "models/user.model/verificationToken.model";

export default class UserRouter {
  public userRouter: express.Router;

  constructor() {
    this.userRouter = express.Router();
  }

  private routes() {}

  private registerUser(req: express.Request, res: express.Response) {
    const { username, email, password, firstName, lastName } = req.body;
    if (!username) {
      return res.status(400).send({
        successState: false,
        message: "Username is missing",
        timestamp: new Date(),
      });
    }
    if (!email) {
      return res.status(400).send({
        successState: false,
        message: "Email is missing",
        timestamp: new Date(),
      });
    }
    if (!username) {
      return res.status(400).send({
        successState: false,
        message: "Username is missing",
        timestamp: new Date(),
      });
    }
    if (!username) {
      return res.status(400).send({
        successState: false,
        message: "Username is missing",
        timestamp: new Date(),
      });
    }
      
  }
}
