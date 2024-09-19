import { Router, Request, Response } from "express";

export class UserRouter {
  router = Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.get("/check", (req: Request, res: Response) => {
      return res.status(200).send({
        successState: true,
        message: "User Router established",
        timestamp: new Date().getTime(),
      });
    });
    
  }
}

export default new UserRouter().router;
