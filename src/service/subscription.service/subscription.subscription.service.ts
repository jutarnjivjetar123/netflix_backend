import User from "../../models/user.model/user.model";

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
    //Check does User object related to UserPublicId with provided userPublicId exist
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User does not exist", null, 404);
    }

    //Check does User object have an existing relation with Subscription object
    const existingSubscription =
      await SubscriptionRepository.getSubscriptionByUser(user);
    if (existingSubscription) {
      return new ReturnObjectHandler(
        "User already has a subscription to this service",
        null,
        400
      );
    }

    //Get Offer object with provided offerId
    const offer = await OfferService.getOfferById(offerId);

    if (!offer) {
      return new ReturnObjectHandler(
        "No offer with id: " + offerId + " exists",
        null,
        404
      );
    }

    //Get PaymentDevice for User with userId
    const paymentDevice = await PaymentDeviceService.getPaymentDeviceByUser(
      user
    );
    if (!paymentDevice.returnValue) {
      return new ReturnObjectHandler(
        "No payment device connected to user",
        null,
        400
      );
    }
    const subscription = await SubscriptionRepository.createSubscription(
      user,
      offer.returnValue,
      paymentDevice.returnValue
    );

    if (!subscription) {
      return new ReturnObjectHandler(
        "Failed to create Subscription for " + userPublicId,
        null,
        400
      );
    }
    return new ReturnObjectHandler(
      "Created new Subscription for " + userPublicId,
      subscription,
      200
    );
  }
}
