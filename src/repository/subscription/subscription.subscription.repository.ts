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

  public static async deleteSubscription(subscription: Subscription) {
    const deletionResult = await DatabaseConnection.getRepository(Subscription)
      .remove(subscription)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Subscription::Repository::Subscription::deleteSubscription::Removed Subscription object from database, removed object data: " +
            subscription
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Subscription::Repository::Subscription::deleteSubscription::Could not remove Subscription object from database, because the following error occurred: " +
            error.message +
            ", Subscription object which deletion was attempted: " +
            subscription
        );
        return false;
      });

    return deletionResult;
  }

  public static async updateSubscription(
    subscription: Subscription,
    offer?: Offer,
    expiresAt?: string,
    isActive?: boolean
  ) {}
}
