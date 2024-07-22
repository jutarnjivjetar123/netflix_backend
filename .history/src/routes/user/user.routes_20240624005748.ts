import express from "express";

import User from "models/user.model/email.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserHash from "models/user.model/hash.model";
import UserVerificationToken from "models/user.model/verificationToken.model";

export default class UserRouter {
  public router: express.Router;

  constructor() {}

  private routes(): void {}

  private createUser(req: express.Request, res: express.Response) {
    const { username, password, email } = req.body;
      if (!username) {

        console.log(
            new Date() +
              " -> LOG::Error::UserRouter::createUser::NoVariableSpecified::Missing required variables::Could not create new user"
          );
          return null;
      return res.status(400).send({
        successState: false,
        message: "Username is required",
        timestamp: new Date(),
      });
    }
  }
}