import { Router, Request, Response } from "express";

class GiftCardRouter {
  router = Router();

  /**
   *
   */
  constructor() {
    this.routes();
  }

    routes() {
      
        //Route for generating new gift card
        this.router.post("", async (req: Request, res: Response) => { 
            
        })
  }
}
