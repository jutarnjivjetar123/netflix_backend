import User from "../../models/user.model/user.model";
import Subscription from "../../models/subscription.model/subscription.model";
import Offer from "../../models/subscription.model/offer.model";
import UserService from "../user.service/main.user.service";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import SubscriptionRepository from "../../repository/subscription/subscription.subscription.repository";
import OfferService from "../subscription.service/offer.subscription.service";
import validator from "validator";
import CreditOrDebitCardService from "./creditOrDebitCard.paymentMethod.subscription.service";
import DigitalWalletService from "./digitalWallet.paymentMethod.subscription.service";

export default class SubscriptionService {
  public static async createNewSubscription(
    userPublicId: string,
    selectedOfferId: string
  ): Promise<ReturnObjectHandler<Subscription | null>> {
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "User identification is not valid",
        null,
        400
      );
    }

    if (!validator.isNumeric(selectedOfferId)) {
      return new ReturnObjectHandler("Offer Id is not valid", null, 400);
    }

    //Get the User by publicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get the Offer with given Id
    const offer = await OfferService.getOfferById(Number(selectedOfferId));
    if (!offer.returnValue) {
      return new ReturnObjectHandler("Offer not found", null, 404);
    }

    //Check does User have Credit or Debit card already set as default payment method
    const checkForDefaultCardAsPaymentMethod =
      await CreditOrDebitCardService.getDefaultCreditOrDebitCardByUser(user);

    //If no CreditOrDebitCard object with value isDefaultForUser property set to true, then DigitalWallet payment method type is checked for property isDefaultForUser with value set as true
    
    if (!checkForDefaultCardAsPaymentMethod.returnValue) {
      console.log("No default card found");
      const checkForDefaultDigitalWalletPaymentMethod =
        await DigitalWalletService.getDefaultDigitalWalletByUser(user);
      if (!checkForDefaultDigitalWalletPaymentMethod.returnValue) {
        console.log("No default wallet found");
        return new ReturnObjectHandler(
          "Having a default payment method is required to proceed",
          null,
          301
        );
      }
    }

    //Check does User already have a Subscription
    const existingSubscription =
      await SubscriptionRepository.getSubscriptionByUser(user);
    if (existingSubscription) {
      return new ReturnObjectHandler("User is already subscribed", null, 401);
    }

    //Create new Subscription
    const newSubscription = await SubscriptionRepository.createSubscription(
      user,
      offer.returnValue
    );

    if (!newSubscription) {
      return new ReturnObjectHandler(
        "Could not create subscription",
        null,
        500
      );
    }

    return new ReturnObjectHandler(
      "Subscription created",
      newSubscription,
      200
    );
  }
}
