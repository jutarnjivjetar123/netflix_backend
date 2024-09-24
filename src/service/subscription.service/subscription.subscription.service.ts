import User from "../../models/user.model/user.model";
import Subscription from "../../models/subscription.model/subscription.model";
import Offer from "../../models/subscription.model/offer.model";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";

import UserService from "../user.service/main.user.service";

import ReturnObjectHandler from "../../utilities/returnObject.utility";
import SubscriptionRepository from "../../repository/subscription/subscription.subscription.repository";
import OfferService from "../subscription.service/offer.subscription.service";
import PaymentDeviceService from "./paymentDevice.subscription.service";

export default class SubscriptionService {
  public static async createSubscription(
    userPublicId: string,
    offerId: number
  ) {
    //Get User object associated with given publicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("No user with publicId found", null, 404);
    }

    //Get Offer with given offerId
    const offer = await OfferService.getOfferById(offerId);
    if (!offer.returnValue) {
      return new ReturnObjectHandler("No offer with ID " + offerId, null, 400);
    }

    //Check does User have existing Subscription
    const existingSubscription =
      await SubscriptionRepository.getSubscriptionByUser(user);

    if (existingSubscription) {
      return new ReturnObjectHandler(
        "User already has an active subscription",
        null,
        400
      );
    }

    //Get PaymentDevice with attribute isDefault set to true for given User
    const defaultPaymentDevice =
      await PaymentDeviceService.getDefaultPaymentDeviceByUser(user);
    console.log(defaultPaymentDevice.returnValue);
    if (!defaultPaymentDevice.returnValue) {
      return new ReturnObjectHandler(
        "Please select a default payment device",
        null,
        409
      );
    }

    //Attempt to create new Subscription with provided data
    const subscription = await SubscriptionRepository.createSubscription(
      user,
      offer.returnValue,
      defaultPaymentDevice.returnValue
    );

    if (!subscription) {
      return new ReturnObjectHandler(
        "Error occurred while trying to save subscription, please try again",
        null,
        500
      );
    }
    return new ReturnObjectHandler("Subscription created", "Success", 200);
  }

  //Get Subscription associated with given User object

  public static async getSubscriptionByUser(
    user: User
  ): Promise<ReturnObjectHandler<Subscription | null>> {
    const subscription = await SubscriptionRepository.getSubscriptionByUser(
      user
    );

    if (!subscription) {
      return new ReturnObjectHandler("User is not subscribed", null, 400);
    }

    return new ReturnObjectHandler(
      "User with active subscription found",
      subscription,
      200
    );
  }
}
