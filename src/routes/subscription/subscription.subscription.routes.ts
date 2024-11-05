import { Request, Response, Router } from "express";
import SubscriptionService from "../../service/subscription.service/subscription.subscription.service";
import validator from "validator";
import CreditOrDebitCardService from "../../service/subscription.service/creditOrDebitCard.paymentMethod.subscription.service";
import DigitalWalletService from "../../service/subscription.service/digitalWallet.paymentMethod.subscription.service";
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

    //Route for fetching all the data related to the given User's Subscription
    this.router.get("", async (req: Request, res: Response) => {
      const { userPublicId } = req.body;

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

      //Fetch the Subscription
      const userSubscription =
        await SubscriptionService.getSubscriptionByPublicId(userPublicId);

      if (!userSubscription.returnValue) {
        return res.status(userSubscription.statusCode).send({
          message: userSubscription.message,
          timestamp: new Date(),
        });
      }

      //Fetch the Default Payment Device related to the given User
      const defaultCard =
        await CreditOrDebitCardService.getDefaultCreditOrDebitCardByUser(
          userSubscription.returnValue.user
        );
      let digitalWallet = null;
      //If there is no default card as payment method, then digital wallet is fetched
      if (defaultCard.returnValue === null) {
        digitalWallet =
          await DigitalWalletService.getDefaultDigitalWalletByUser(
            userSubscription.returnValue.user
          );
        console.log(digitalWallet);
      }

      console.log(digitalWallet);

      //Divide the Subscription and related data into components which only return selected data required for the client usage without comprising the security of the database

      //User data extracted from the Subscription
      const user = {
        publicId: userPublicId,
      };

      //Offer data extracted from the Subscription
      const offer = {
        offerId: userSubscription.returnValue.offer.offerId,
        offerTitle: userSubscription.returnValue.offer.offerTitle,
        offerValue: userSubscription.returnValue.offer.monthlyBillingAmount,
        maxNumberOfDevicesToDownload:
          userSubscription.returnValue.offer.maxNumberOfDevicesToDownload,
        maxNumberOfDevicesToWatch:
          userSubscription.returnValue.offer.maxNumberOfDevicesToWatch,
        resolutionQuality: userSubscription.returnValue.offer.resolutionQuality,
        supportedDevices: userSubscription.returnValue.offer.supportedDevices,
        isSpatialAudio: userSubscription.returnValue.offer.isSpatialAudio,
      };

      let paymentMethod = null;
      if (
        defaultCard.returnValue !== null &&
        digitalWallet.returnValue === null
      ) {
        paymentMethod = {
          type: defaultCard.returnValue.paymentMethod.type,
          serviceProvider:
            defaultCard.returnValue.paymentMethod.serviceProvider,
          serviceProviderSvgLogo:
            defaultCard.returnValue.paymentMethod.serviceProviderSvgLogo,
          cardNumber: defaultCard.returnValue.cardNumber,
          nameOnCard: defaultCard.returnValue.nameOnCard,
        };
      }
      if (
        digitalWallet.returnValue !== null &&
        defaultCard.returnValue === null
      ) {
        paymentMethod = {
          type: digitalWallet.returnValue.paymentMethod.type,
          serviceProvider:
            digitalWallet.returnValue.paymentMethod.serviceProvider,
          serviceProviderSvgLogo:
            digitalWallet.returnValue.paymentMethod.serviceProviderSvgLogo,
          email: digitalWallet.returnValue.email,
          walletLink: digitalWallet.returnValue.walletLink,
        };
      }
      return res.status(200).send({
        message: "User subscription found",
        data: {
          user: user,
          offer: offer,
          paymentMethod: paymentMethod,
        },
        timestamp: new Date(),
      });
    });
    //Route for setting the Subscription status to active (property isActive to true)
    //Or deleting the Subscription object entirely
    this.router.put("/activate", async (req: Request, res: Response) => {
      const { userPublicId, subscriptionStatus } = req.body;
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

      if (subscriptionStatus === null) {
        return res.status(400).send({
          message: "Subscription status is required",
          timestamp: new Date(),
        });
      }

      //Subscription status is boolean - true for activating the Subscription and false for deleting the Subscription
      if (
        typeof subscriptionStatus !== "boolean" &&
        (String(subscriptionStatus) !== "true" ||
          String(subscriptionStatus) !== "false")
      ) {
        return res.status(400).send({
          message: "Subscription status is not valid",
          timestamp: new Date(),
        });
      }

      //Depending on the subscriptionStatus call the appropriate method
      //If subscriptionStatus is true, then call the method for activating the Subscription
      if (subscriptionStatus || String(subscriptionStatus) === "true") {
        const isSubscriptionActivated =
          await SubscriptionService.updateSubscriptionByUserPublicId(
            userPublicId,
            null,
            true
          );

        if (!isSubscriptionActivated.returnValue) {
          if (
            isSubscriptionActivated.message ===
            "No parameters provided for update"
          ) {
            return res.status(400).send({
              message: "Subscription has been already activated",
              timestamp: new Date(),
            });
          }
          return res.status(isSubscriptionActivated.statusCode).send({
            message: isSubscriptionActivated.message,
            timestamp: new Date(),
          });
        }
        return res.status(200).send({
          message: "Subscription activated",
          timestamp: new Date(),
        });
      }

      //If subscriptionStatus is false, then call the method for deleting the Subscription
      if (
        subscriptionStatus === false ||
        String(subscriptionStatus) === "false"
      ) {
        const isSubscriptionDeleted =
          await SubscriptionService.deleteSubscriptionByUserPublicId(
            userPublicId
          );

        if (!isSubscriptionDeleted.returnValue) {
          if (isSubscriptionDeleted.statusCode === 500) {
            return res.status(500).send({
              message:
                "We could not remove your subscription for now, please try again later",
              timestamp: new Date(),
            });
          }
          return res.status(isSubscriptionDeleted.statusCode).send({
            message: isSubscriptionDeleted.message,
            timestamp: new Date(),
          });
        }
        return res.status(200).send({
          message: "Subscription deleted",
          timestamp: new Date(),
        });
      }
    });
  }
}

export default new SubscriptionRouter().router;
