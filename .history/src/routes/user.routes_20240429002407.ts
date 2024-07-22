import express from "express";
import UserRepository from "repository/user.repository";

export default class UserRouter {
  userRepo: UserRepository;
  static router: express.Router;
  constructor() {
    this.userRepo = new UserRepository();
    UserRouter.router = express.Router();
  }

  static async 
}
