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

  //Get the Subscription object by the User connected to the given publicId
  public static async getSubscriptionByPublicId(
    userPublicId: string
  ): Promise<ReturnObjectHandler<Subscription>> {
    //Check is userPublicId in valid UUID format
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "User identification is not valid",
        null,
        400
      );
    }

    //Get the User by userPublicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get the Subscription by User
    const subscription = await SubscriptionRepository.getSubscriptionByUser(
      user
    );
    if (!subscription) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
    }

    return new ReturnObjectHandler("Subscription found", subscription, 200);
  }

  //Method for updating Subscription object based on the User with given publicId
  public static async updateSubscriptionByUserPublicId(
    userPublicId: string,
    offerId: number = null,
    isActive: boolean = null
  ) {
    //Check is userPublicId in valid UUID format
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        400
      );
    }

    //Get the User by public identification
    const user = await UserService.getUserByPublicId(userPublicId);

    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Check is any of the given parameters not null
    if (offerId === null && isActive === null) {
      return new ReturnObjectHandler(
        "No parameters provided for update",
        null,
        400
      );
    }

    //Get the Subscription by User
    const subscription = await SubscriptionRepository.getSubscriptionByUser(
      user
    );
    if (!subscription) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
    }

    //Check are any of the provided parameters updated

    //Check for the offerId
    const isOfferUpdated =
      offerId !== null && offerId !== subscription.offer.offerId;

    //Check for the isActive
    const isActiveUpdated =
      isActive !== null && isActive !== subscription.isActive;

    //Check is any of the given parameters updated
    if (!isActiveUpdated && !isOfferUpdated) {
      return new ReturnObjectHandler(
        "No parameters provided for update",
        null,
        400
      );
    }

    let tempSubscriptionWithUpdatedValues = {
      offer: null,
      isActive: null,
      expiresAt: null,
    };
    //Get the Offer with given offerId

    if (isOfferUpdated) {
      const offer = await OfferService.getOfferById(offerId);
      if (!offer.returnValue) {
        return new ReturnObjectHandler("Offer not found", null, 404);
      }
      tempSubscriptionWithUpdatedValues.offer = offer.returnValue;
    }

    ///If the isActive property is updated, update it inside the Subscription object
    //Also extend the expiry date of the Subscription by a month ( expiresAt by 30 days)

    if (isActiveUpdated) {
      tempSubscriptionWithUpdatedValues.expiresAt = new Date(
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000
      )
        .getTime()
        .toString();

      tempSubscriptionWithUpdatedValues.isActive = isActive;
    }

    //Attempt to update the Subscription object
    const updatedSubscription = await SubscriptionRepository.updateSubscription(
      subscription,
      tempSubscriptionWithUpdatedValues.offer,
      tempSubscriptionWithUpdatedValues.expiresAt,
      tempSubscriptionWithUpdatedValues.isActive
    );

    if (!updatedSubscription) {
      return new ReturnObjectHandler(
        "Could not update Subscription",
        null,
        500
      );
    }

    return new ReturnObjectHandler(
      "Subscription updated",
      updatedSubscription,
      200
    );
  }

  //Method for deleting Subscription object connected to the found User with the provided userPublicId
  public static async deleteSubscriptionByUserPublicId(
    userPublicId: string
  ): Promise<ReturnObjectHandler<boolean>> {
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "User identification is not valid",
        false,
        400
      );
    }

    //Get the User by public identification
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", false, 404);
    }

    //Get the Subscription by User
    const subscription = await SubscriptionRepository.getSubscriptionByUser(
      user
    );

    if (!subscription) {
      return new ReturnObjectHandler("User is not subscribed", false, 401);
    }

    //Attempt to delete the Subscription
    const isSubscriptionDeleted =
      await SubscriptionRepository.deleteSubscriptionByUser(user);

    if (!isSubscriptionDeleted) {
      return new ReturnObjectHandler(
        "Subscription could not be deleted",
        false,
        500
      );
    }

    return new ReturnObjectHandler("Subscription deleted", true, 200);
  }
}
