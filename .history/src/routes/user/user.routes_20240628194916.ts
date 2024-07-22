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
    const { email, phoneNumber, password, firstName, lastName } = req.body;

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
    if (!email && !phoneNumber) {
      console.log(
        new Date() +
          " -> LOG::Error::UserRouter::createUser::email - phoneNumber::Missing email and phoneNumber::Could not create new user::Returning 400"
      );
      return res.status(400).send({
        successState: false,
        message: "Phone number or email is required",
        timestamp: new Date(),
      });
    }

    if (email && !phoneNumber) { 

    }
    
}

export default new UserRouter().router;
