import { DatabaseConnection } from "../../database/config.database";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";
import User from "../../models/user.model/user.model";
import UserPublicId from "../../models/user.model/publicId.model";

export default class PaymentDeviceRepository {
  public static async createPaymentDevice(
    ownedByUser: User,
    cardholderName: string,
    lastFourDigits: string,
    expirationDate: Date,
    cardType: boolean,
    serviceProvider: string,
    billingAddress: string
  ) {
    const newPaymentDevice = new PaymentDevice();
    newPaymentDevice.user = ownedByUser;
    newPaymentDevice.cardholderName = cardholderName;
    newPaymentDevice.lastFourDigits = lastFourDigits;
    newPaymentDevice.expirationDate = expirationDate;
    newPaymentDevice.cardType = cardType;
    newPaymentDevice.serviceProvider = serviceProvider;
    newPaymentDevice.billingAddress = billingAddress;
    newPaymentDevice.createdAt = new Date();

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
  public static async getAllPaymentDeviceByUser(
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
            " -> LOG::Info::Repository::Subscription::PaymentDevice::getPaymentDeviceByUser::Found PaymentDevice object related to user with id: " +
            data[0].user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentDevice::getPaymentDeviceByUser::Error occurred whilst seeking the PaymentDevice object related to user with id: " +
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
          " -> LOG::Info::Repository::Subscription::PaymentDevice::getPaymentDeviceByUser::No PaymentDevice object was found related to user with id: " +
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
    expirationDate?: Date,
    cardType?: boolean,
    serviceProvider?: string,
    billingAddress?: string
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

    const updateResult = await DatabaseConnection.getRepository(PaymentDevice)
      .save(paymentDevice)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentDevice::updatePaymentDevice::Updated PaymentDevice object related to user with id" +
            paymentDevice.user.userId
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
}