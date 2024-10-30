import { Request, Response, Router } from "express";

class SubscriptionRouter {
  router = Router();

  constructor() {
    this.routes();
  }
  routes() {}
}

export default new SubscriptionRouter().router;
