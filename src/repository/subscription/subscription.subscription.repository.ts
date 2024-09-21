import { DatabaseConnection } from "../../database/config.database";

import Subscription from "../../models/subscription.model/subscription.model";
import User from "../../models/user.model/user.model";
import Offer from "../../models/subscription.model/offer.model";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";
export default class SubscriptionRepository {
  public static async getSubscriptionByUser(user: User) {
    const result = await DatabaseConnection.getRepository(Subscription)
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
  ) {
    const newSubscription = new Subscription();
    newSubscription.user = user;
    newSubscription.offer = offer;
    newSubscription.paymentDevice = paymentDevice;
    newSubscription.expiresAt = (
      new Date().getTime() +
      30 * 24 * 60 * 60 * 1000
    ).toString();
    newSubscription.monthlyCost = offer.monthlyBillingAmount;
    newSubscription.isActive = true;
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
}
