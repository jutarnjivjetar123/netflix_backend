import express from "express";
import UserRepository from "repository/user.repository";

export default class UserRouter {
  userRepo: UserRepository;
  constructor() {
      this.userRepo = new UserRepository();
      const router = express.Router();
  }

    static async addNewUser(req: express.Request, res: express.Response) { 

        
    }
    
}