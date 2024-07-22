import express from "express";
import UserRepository from "repository/user.repository";

export default class UserRouter {
  userRepo: UserRepository;
  static router: express.Router;
  constructor() {
    this.userRepo = new UserRepository();
    UserRouter.router = express.Router();
  }

  static async addNewUser(req: express.Request, res: express.Response) {
    try {
      this.user;
      const newUser = await userRepo.addNewUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {}
  }
}
