import { Request, Response, Router } from "express";
import SubscriptionService from "../../service/subscription.service/subscription.subscription.service";

class SubscriptionRouter {
  router = Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      const { userPublicId, offerId } = req.body;

      //Check are parameters userPublicId and offerId provided
      if (!userPublicId && !offerId) {
        return res.status(400).send({
          message: "Missing parameters",
          timestamp: new Date(),
        });
      }
      //Try to create Subscription related to given userPublicId with provided offerId
      const subscription = await SubscriptionService.createSubscription(
        userPublicId,
        offerId
      );
      if (subscription.statusCode !== 200) {
        return res.status(subscription.statusCode).send({
          message: subscription.message,
          timestamp: new Date(),
        });
      }

      return res.status(subscription.statusCode).send({
        message: subscription.message,
        subscription: {
          offer: subscription.returnValue.offer,
          expiresAt: subscription.returnValue.expiresAt,
        },
        redirectLink: "http://localhost:5005/signup/complete",
        publicId: userPublicId,
        timestamp: new Date(),
      });
    });
  }
}

export default new SubscriptionRouter().router;
