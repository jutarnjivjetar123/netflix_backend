import { DatabaseConnection } from "../../database/config.database";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";
import User from "../../models/user.model/user.model";
import UserPublicId from "../../models/user.model/publicId.model";

export default class PaymentDeviceRepository {
  public static async createPaymentDevice(
    ownedByUser: User,
    cardholderName: string,
    lastFourDigits: string,
    expirationDate: string,
    cardType: boolean,
    serviceProvider: string,
    billingAddress: string,
    isDefault: boolean
  ) {
    const newPaymentDevice = new PaymentDevice();
    newPaymentDevice.user = ownedByUser;
    newPaymentDevice.cardholderName = cardholderName;
    newPaymentDevice.lastFourDigits = lastFourDigits;
    newPaymentDevice.expirationDate = expirationDate;
    newPaymentDevice.cardType = cardType;
    newPaymentDevice.serviceProvider = serviceProvider;
    newPaymentDevice.billingAddress = billingAddress;
    newPaymentDevice.isDefault = isDefault;
    newPaymentDevice.createdAt = new Date().getTime().toString();

    const result = await DatabaseConnection.getRepository(PaymentDevice)
      .save(newPaymentDevice)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::createPaymentDevice::New PaymentDevice object for user with id: " +
            data.user.userId +
            " created successfully"
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentDevice::createPaymentDevice::Failed to create new PaymentDevice object for user with id: " +
            ownedByUser.userId +
            ", error message: " +
            error.message
        );
        return null;
      });

    return result;
  }
  public static async getPaymentDevicesByUser(
    user: User
  ): Promise<PaymentDevice[] | null> {
    const paymentDevice = await DatabaseConnection.getRepository(PaymentDevice)
      .find({
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
            " -> LOG::Info::Repository::Subscription::PaymentDevice::getPaymentDevicesByUser::Found PaymentDevice object related to user with id: " +
            data[0].user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentDevice::getPaymentDevicesByUser::Error occurred whilst seeking the PaymentDevice object related to user with id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
    if (!paymentDevice) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::Subscription::PaymentDevice::getPaymentDevicesByUser::No PaymentDevice object was found related to user with id: " +
          user.userId
      );
    }
    return paymentDevice;
  }

  public static async updatePaymentDevice(
    user: User,
    paymentDevice: PaymentDevice,
    cardholderName?: string,
    lastFourDigits?: string,
    expirationDate?: string,
    cardType?: boolean,
    serviceProvider?: string,
    billingAddress?: string,
    isDefault?: boolean
  ): Promise<boolean> {
    paymentDevice.cardholderName !== cardholderName
      ? (paymentDevice.cardholderName = cardholderName)
      : paymentDevice.cardholderName;

    paymentDevice.lastFourDigits !== lastFourDigits
      ? (paymentDevice.lastFourDigits = lastFourDigits)
      : paymentDevice.lastFourDigits;

    paymentDevice.expirationDate !== expirationDate
      ? (paymentDevice.expirationDate = expirationDate)
      : paymentDevice.expirationDate;

    paymentDevice.cardType !== cardType
      ? (paymentDevice.cardType = cardType)
      : paymentDevice.cardType;

    paymentDevice.serviceProvider !== serviceProvider
      ? (paymentDevice.serviceProvider = serviceProvider)
      : paymentDevice.serviceProvider;

    paymentDevice.billingAddress !== billingAddress
      ? (paymentDevice.billingAddress = billingAddress)
      : paymentDevice.billingAddress;
    paymentDevice.isDefault !== isDefault
      ? (paymentDevice.isDefault = isDefault)
      : paymentDevice.isDefault;

    const updateResult = await DatabaseConnection.getRepository(PaymentDevice)
      .save(paymentDevice)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::updatePaymentDevice::Updated PaymentDevice object related to user with id" +
            data.user.userId
        );
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::updatePaymentDevice::Could not update PaymentDevice object related to user with id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return false;
      });

    return updateResult;
  }

  public static async getPaymentDeviceByPaymentDeviceId(
    paymentDeviceId: string
  ): Promise<PaymentDevice | null> {
    return await DatabaseConnection.getRepository(PaymentDevice)
      .findOne({
        where: {
          paymentDeviceId: paymentDeviceId,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::getPaymentDeviceByPaymentDeviceId::Found payment device with id: " +
            data.paymentDeviceId +
            " with userId: " +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentDevice::Error occurred while trying to find PaymentDevice with paymentDeviceId: " +
            paymentDeviceId +
            ", error: " +
            error.message
        );
        return null;
      });
  }

  public static async getDefaultPaymentDeviceByUser(user: User) {
    const defaultPaymentDevice = await DatabaseConnection.getRepository(
      PaymentDevice
    )
      .findOne({
        where: {
          user: user,
          isDefault: true,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::getDefaultPaymentDeviceByUser::Found PaymentDevice with isDefault set to true for User with Id: " +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentDevice::getDefaultPaymentDeviceByUser::Error occurred while trying to find PaymentDevice with isDefault set to true associated with User with Id: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });

    if (!defaultPaymentDevice) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Repository::Subscription::PaymentDevice::getDefaultPaymentDeviceByUser::No PaymentDevice with isDefault attribute set to true was found associated with User with Id: " +
          user.userId
      );
    }
    return defaultPaymentDevice;
  }

  //Attempt to remove PaymentDevice object provided in the function parameter, returns boolean value, depending on the success of the deletion operation
  public static async removePaymentDevice(
    paymentDevice: PaymentDevice
  ): Promise<boolean> {
    return await DatabaseConnection.getRepository(PaymentDevice)
      .remove(paymentDevice)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::removePaymentDevice::Successfully removed PaymentDevice object from the database, removed object data: " +
            paymentDevice
        );

        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " LOG::Error::Repository::Subscription::PaymentDevice::Failed to remove PaymentDevice object from database, because error occurred, error message: " +
            error.message +
            ", object which was supposed to be removed: " +
            paymentDevice
        );
        return false;
      });
  }
}
