import { DatabaseConnection } from "../../database/config.database";

import Subscription from "../../models/subscription.model/subscription.model";
import User from "../../models/user.model/user.model";
import Offer from "../../models/subscription.model/offer.model";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";

export default class SubscriptionRepository {
  public static async getSubscriptionByUser(
    user: User
  ): Promise<Subscription | null> {
    const result = await DatabaseConnection.getRepository(Subscription)
      .findOne({
        where: {
          user: user,
        },
        relations: {
          user: true,
          offer: true,
          paymentDevice: true,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::Subscription::getSubscriptionByUser::Found Subscription object related to User with id: " +
            data.user.userId +
            ", subscription data: " +
            data
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::Subscription::getSubscriptionByUser::Failed to retrieve Subscription object related to User with id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });

    if (!result) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::Subscription::Subscription::getSubscriptionByUser::No Subscription object was found in relation with User with id: " +
          user.userId
      );
    }
    return result;
  }

  public static async createSubscription(
    user: User,
    offer: Offer,
    paymentDevice: PaymentDevice
  ): Promise<Subscription | null> {
    const newSubscription = new Subscription();
    newSubscription.user = user;
    newSubscription.offer = offer;
    newSubscription.paymentDevice = paymentDevice;
    newSubscription.expiresAt = (
      new Date().getTime() +
      30 * 24 * 60 * 60 * 1000
    ).toString();
    newSubscription.monthlyCost = offer.monthlyBillingAmount;
    newSubscription.isActive = false;
    newSubscription.createdAt = new Date().getTime().toString();

    return await DatabaseConnection.getRepository(Subscription)
      .save(newSubscription)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::Subscription::createSubscription::Successfully created new Subscription object for User object with id: " +
            data.user.userId +
            ", Subscription data: " +
            data
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::Subscription::Failed to create new Subscription object for User object with id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  public static async updateSubscription(
    subscription: Subscription,

    newPaymentDevice?: PaymentDevice,
    newOffer?: Offer,
    newExpiryDateTime?: string,
    isActive?: boolean
  ): Promise<Subscription | null> {
    if (newPaymentDevice) {
      subscription.paymentDevice =
        subscription.paymentDevice.paymentDeviceId !==
        newPaymentDevice.paymentDeviceId
          ? newPaymentDevice
          : subscription.paymentDevice;
    }
    if (newOffer) {
      subscription.offer =
        subscription.offer.offerId !== newOffer.offerId
          ? newOffer
          : subscription.offer;
    }
    if (newExpiryDateTime) {
      subscription.expiresAt =
        subscription.expiresAt !== newExpiryDateTime
          ? newExpiryDateTime
          : subscription.expiresAt;
    }
    if (isActive) {
      subscription.isActive =
        subscription.isActive !== isActive ? isActive : subscription.isActive;
    }
    subscription.modifiedAt = new Date().getTime().toString();
    return await DatabaseConnection.getRepository(Subscription)
      .save(subscription)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::Subscription::updateSubscription::Subscription was updated, Subscription id: " +
            subscription.subscriptionId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::Subscription::updateSubscription::Failed to update Subscription object with Id: " +
            subscription.subscriptionId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  //Function to delete Subscription from the database, based on the provided User
  public static async deleteSubscriptionByUser(user: User) {
    //Fetch Subscription object related to the given User object
    const subscription = await DatabaseConnection.getRepository(Subscription)
      .findOne({
        where: {
          user: user,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::Subscription::deleteSubscriptionByUser::Found Subscription object related to the provided User object, Subscription object data: " +
            data
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Error::Repository::Subscription::Subscription::deleteSubscriptionByUser::Error occurred while trying to fetch Subscription object related to the User with id:  " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
    if (!subscription) {
      return false;
    }
    //Attempt to delete given Subscription object from the database, if successful return true, if fails return false
    return await DatabaseConnection.getRepository(Subscription)
      .remove(subscription)
      .then((result) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::Subscription::deleteSubscriptionByUser::Successfully delete Subscription object related to the User with Id:" +
            user.userId +
            "\nDeleted Subscription object data: " +
            subscription +
            "\nDELETE operation information: \n" +
            result
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::Subscription::deleteSubscriptionByUser::Error occurred while trying to delete Subscription object related to the User with Id: " +
            user.userId +
            ", error message: " +
            error.message +
            ",\n Subscription object: " +
            subscription
        );
        return false;
      });
  }
}
