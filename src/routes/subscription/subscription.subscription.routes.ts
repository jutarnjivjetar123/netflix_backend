import { Request, Response, Router } from "express";
import SubscriptionService from "../../service/subscription.service/subscription.subscription.service";
import validator from "validator";
import CreditOrDebitCardService from "service/subscription.service/creditOrDebitCard.paymentMethod.subscription.service";
class SubscriptionRouter {
  router = Router();

  constructor() {
    this.routes();
  }
  routes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      const { userPublicId, offerId } = req.body;

      if (!userPublicId) {
        return res.status(400).send({
          message: "User identification is required",
          timestamp: new Date(),
        });
      }

      if (!validator.isUUID(userPublicId)) {
        return res.status(400).send({
          message: "User identification is not valid",
          timestamp: new Date(),
        });
      }

      if (!offerId) {
        return res.status(400).send({
          message: "Offer identification must be provided",
          timestamp: new Date(),
        });
      }

      if (!validator.isNumeric(offerId)) {
        return res.status(400).send({
          message: "Offer identification is not valid",
          timestamp: new Date(),
        });
      }

      const createdSubscription =
        await SubscriptionService.createNewSubscription(userPublicId, offerId);
      if (createdSubscription.statusCode === 301) {
        return res.status(createdSubscription.statusCode).send({
          message: createdSubscription.message,
          data: {
            redirectionLink: "http://localhost:3000/payment/select",
          },
          timestamp: new Date(),
        });
      }
      if (!createdSubscription.returnValue) {
        return res.status(createdSubscription.statusCode).send({
          message: createdSubscription.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        message: "User is subscribed",
        data: {
          subscription: createdSubscription.returnValue,
        },
        timestamp: new Date(),
      });
    });
  }
}

export default new SubscriptionRouter().router;
