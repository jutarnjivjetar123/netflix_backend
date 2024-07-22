import express from "express";
import UserRepository from "repository/user.repository";

export default class UserRouter {
  userRepo: UserRepository;
  constructor() {
    this.userRepo = new UserRepository();
     router = express.Router();
  }

  static async addNewUser(req: express.Request, res: express.Response) {
      try {
        this.user
      const newUser = await userRepo.addNewUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {}
  }
}
