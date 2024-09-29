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

  //Function to delete Subscription based on the provided User
  public static async deleteSubscriptionByUser(user: User) {
    //Attempt to fetch the Subscription object related to the given User
    const subscription = await SubscriptionRepository.getSubscriptionByUser(
      user
    );
    if (!subscription) {
      return new ReturnObjectHandler("User is not subscribed", false, 401);
    }

    //Attempt to delete the Subscription object related to the given User
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

  //Function to try to update Subscription object found based on the provided User object
  public static async updateSubscriptionByUser(
    user: User,
    newOffer?: Offer,
    newPaymentDevice?: PaymentDevice,
    newExpiryDateTime?: string,
    newIsActive?: boolean
  ) {
    //Check does given User object have a relation with Subscription
    const subscription = await this.getSubscriptionByUser(user);
    if (!subscription.returnValue) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
    }

    //Check is are the provided values to update different to those one already found in an existing Subscription object

    //Check is existing offer different to the one stored in the database
    let isOfferSet = false;
    console.log("OFFER");
    console.log("Existing offer:");
    console.log(subscription.returnValue.offer);
    console.log("New offer:");
    console.log(newOffer);
    if (newOffer) {
      const offer = subscription.returnValue.offer;
      console.log(
        "Is same? " +
          (offer.isSpatialAudio === newOffer.isSpatialAudio ||
            offer.maxNumberOfDevicesToDownload ===
              newOffer.maxNumberOfDevicesToDownload ||
            offer.maxNumberOfDevicesToWatch ===
              newOffer.maxNumberOfDevicesToWatch ||
            offer.maxResolution === newOffer.maxResolution ||
            offer.monthlyBillingAmount === newOffer.monthlyBillingAmount ||
            offer.offerTitle === newOffer.offerTitle)
      );
      isOfferSet =
        offer.isSpatialAudio === newOffer.isSpatialAudio ||
        offer.maxNumberOfDevicesToDownload ===
          newOffer.maxNumberOfDevicesToDownload ||
        offer.maxNumberOfDevicesToWatch ===
          newOffer.maxNumberOfDevicesToWatch ||
        offer.maxResolution === newOffer.maxResolution ||
        offer.monthlyBillingAmount === newOffer.monthlyBillingAmount ||
        offer.offerTitle === newOffer.offerTitle;
      console.log("isOfferSet: " + isOfferSet);
    }
    //Check is the PaymentDevice to which the given Subscription object is connected same as the one inside the database
    let isPaymentDeviceSet = false;
    console.log("PAYMENT DEVICE");
    console.log("Existing payment device:");
    console.log(subscription.returnValue.paymentDevice);
    console.log("New payment device:");
    console.log(newPaymentDevice);
    if (newPaymentDevice) {
      const paymentDevice = subscription.returnValue.paymentDevice;
      console.log(
        "Is same? " + paymentDevice.cardholderName ===
          newPaymentDevice.cardholderName ||
          paymentDevice.lastFourDigits == newPaymentDevice.lastFourDigits ||
          paymentDevice.expirationDate === newPaymentDevice.expirationDate ||
          paymentDevice.cardType === newPaymentDevice.cardType ||
          paymentDevice.serviceProvider === newPaymentDevice.serviceProvider ||
          paymentDevice.billingAddress === newPaymentDevice.billingAddress ||
          paymentDevice.isDefault === paymentDevice.isDefault
      );
      isPaymentDeviceSet =
        paymentDevice.cardholderName !== newPaymentDevice.cardholderName ||
        paymentDevice.lastFourDigits !== newPaymentDevice.lastFourDigits ||
        paymentDevice.expirationDate !== newPaymentDevice.expirationDate ||
        paymentDevice.cardType !== newPaymentDevice.cardType ||
        paymentDevice.serviceProvider !== newPaymentDevice.serviceProvider ||
        paymentDevice.billingAddress !== newPaymentDevice.billingAddress ||
        paymentDevice.isDefault !== paymentDevice.isDefault;
      console.log("isPaymentDeviceSet: " + isPaymentDeviceSet);
    }

    const tempSubscription = subscription.returnValue;
    //Check is expiresAt updated
    let isExpiresAtSet = false;
    console.log("EXPIRES AT");
    console.log("Existing expires at:");
    console.log(subscription.returnValue.expiresAt);
    console.log("New expires at:");
    console.log(newExpiryDateTime);
    if (newExpiryDateTime) {
      console.log(
        "Is same? " + (tempSubscription.expiresAt === newExpiryDateTime)
      );
      isExpiresAtSet = tempSubscription.expiresAt !== newExpiryDateTime;
      console.log("isExpiresAtSet: " + isExpiresAtSet);
    }
    //Check isActive updated
    let isActiveSet = false;
    console.log("IS ACTIVE");
    console.log("Existing is active:");
    console.log(subscription.returnValue.isActive);
    console.log("New is active:");
    console.log(newIsActive);
    if (newIsActive) {
      console.log("Is same? " + (tempSubscription.isActive === newIsActive));
      isActiveSet = tempSubscription.isActive !== newIsActive;
      console.log("isExpiresAtSet: " + isActiveSet);
    }

    //Check is is any of the provided values updated
    if (!isOfferSet && !isActiveSet && !isExpiresAtSet && !isPaymentDeviceSet) {
      return new ReturnObjectHandler(
        "No new values to update were provided",
        null,
        400
      );
    }
    //Attempt to update retrieved Subscription object
    const updatedSubscription = await SubscriptionRepository.updateSubscription(
      subscription.returnValue,
      newPaymentDevice,
      newOffer,
      newExpiryDateTime,
      newIsActive
    );
    if (!updatedSubscription) {
      return new ReturnObjectHandler(
        "Subscription could not be updated",
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
}
