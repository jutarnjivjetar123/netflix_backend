import User from "../../models/user.model/user.model";
import UserPublicId from "../../models/user.model/publicId.model";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";
import PaymentDeviceRepository from "../../repository/subscription/paymentDevice.repository.subscription";
import UserService from "../user.service/main.user.service";

import ReturnObjectHandler from "../../utilities/returnObject.utility";
import validator from "validator";
export default class PaymentDeviceService {
  public static async createPaymentDevice(
    userPublicId: string,
    cardholderName: string,
    lastFourDigits: string,
    expirationDate: Date,
    cardType: boolean,
    serviceProvider: string,
    billingAddress: string
  ): Promise<ReturnObjectHandler<PaymentDevice | null>> {
    if (
      !userPublicId &&
      !cardholderName &&
      !lastFourDigits &&
      !expirationDate &&
      !cardType &&
      !serviceProvider &&
      !billingAddress
    ) {
      return new ReturnObjectHandler("Missing required parameters", null, 400);
    }
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler("Public Id is not valid", null, 400);
    }
    if (new Date(expirationDate) <= new Date()) {
      return new ReturnObjectHandler(
        "Expiration date cannot have value older than current date",
        null,
        400
      );
    }
    //Get User object related to the given userPublicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Check does the PaymentDevice with the same data connected to the User already exist
    const paymentDevicesByUser =
      await PaymentDeviceRepository.getAllPaymentDeviceByUser(user);
    if (paymentDevicesByUser !== null) {
      console.log(
        "Payment devices by User " +
          userPublicId +
          ": " +
          paymentDevicesByUser.length
      );

      if (
        paymentDevicesByUser.some((paymentDevice) => {
          return (
            paymentDevice.billingAddress === billingAddress &&
            paymentDevice.cardType === cardType &&
            paymentDevice.cardholderName === cardholderName &&
            paymentDevice.lastFourDigits === lastFourDigits &&
            paymentDevice.serviceProvider === serviceProvider &&
            paymentDevice
          );
        })
      ) {
        return new ReturnObjectHandler(
          "An existing payment device with the same data for user was found",
          null,
          400
        );
      }
    }

    //Attempt to create a PaymentDevice object in relation with given User relation
    const paymentDevice = await PaymentDeviceRepository.createPaymentDevice(
      user,
      cardholderName,
      lastFourDigits,
      expirationDate,
      cardType,
      serviceProvider,
      billingAddress
    );
    if (!paymentDevice) {
      return new ReturnObjectHandler(
        "Could not save new payment device for user " +
          userPublicId +
          ", please try again later",
        null,
        400
      );
    }

    return new ReturnObjectHandler(
      "Successfully saved payment device for user",
      paymentDevice,
      200
    );
  }

  public static async updatePaymentDevice(
    publicId: string,
    paymentDeviceId: string,
    cardholderName?: string,
    lastFourDigits?: string,
    expirationDate?: Date,
    cardType?: boolean,
    serviceProvider?: string,
    billingAddress?: string
  ) {
    //Check is publicId provided and valid
    if (!publicId) {
      return new ReturnObjectHandler("Public Id must be provided", null, 400);
    }
    if (!validator.isUUID(publicId)) {
      return new ReturnObjectHandler(
        "Public Id is not considered valid",
        null,
        400
      );
    }

    //Check is paymentDeviceId provided and valid
    if (!paymentDeviceId) {
      return new ReturnObjectHandler(
        "Payment device Id must be provided",
        null,
        400
      );
    }
    if (!validator.isUUID(paymentDeviceId)) {
      return new ReturnObjectHandler(
        "Payment device Id is not considered valid",
        null,
        400
      );
    }

    //Check was there any attribute provided to update
    if (
      !cardholderName &&
      !lastFourDigits &&
      !expirationDate &&
      !cardType &&
      !serviceProvider &&
      !billingAddress
    ) {
      return new ReturnObjectHandler(
        "At least one attribute with updated value must be provided",
        null,
        400
      );
    }

    //Check individual attributes to update validity, but before that check was the parameter provided

    //Test is lastFourDigits parameter four characters in length
    if (lastFourDigits && String(lastFourDigits).length !== 4) {
      return new ReturnObjectHandler(
        "Last four digits attribute, must have exactly 4 digits to be considered valid",
        null,
        400
      );
    }

    //Check has the new expiration date already passed
    if (expirationDate && new Date(expirationDate) <= new Date()) {
      return new ReturnObjectHandler(
        "Cannot set expiry date as the one that had already passed",
        null,
        400
      );
    }

    //Get payment devices by paymentDeviceId
    const paymentDevice =
      await PaymentDeviceRepository.getPaymentDeviceByPaymentDeviceId(
        paymentDeviceId
      );
    if (!paymentDevice) {
      return new ReturnObjectHandler("No payment device found", null, 404);
    }

    //Get User by userPublicId
    const user = await UserService.getUserByPublicId(publicId);
    if (!user) {
      return new ReturnObjectHandler("User doesn't exist", null, 404);
    }
    console.log(user);
    console.log(paymentDevice.user);
    //Check is the User identified by the provided userPublicId same as the one identified by the found PaymentDevice using paymentDeviceId
    if (user.userId !== paymentDevice.user.userId) {
      return new ReturnObjectHandler(
        "User is not the owner of the payment device",
        null,
        401
      );
    }

    //Check which of the attributes are the same, for those that are the same don't update them, update only those that have different value. If every provided value to update is the same as the current one, then return an error, specifying that User is stupid

    //Check is cardholderName set to update
    let isCardholderNameSet = false;
    if (cardholderName) {
      if (paymentDevice.cardholderName !== cardholderName) {
        isCardholderNameSet = true;
      }
    }
    //Check is lastFourDigits set to update
    let isLastFourDigitsSet = false;
    if (lastFourDigits) {
      if (paymentDevice.lastFourDigits !== lastFourDigits) {
        isLastFourDigitsSet = true;
      }
    }
    //Check is expirationDate set to update
    let isExpirationDateSet = false;
    if (expirationDate) {
      if (paymentDevice.expirationDate !== expirationDate) {
        isExpirationDateSet = true;
      }
    }
    //Check is cardType set to update
    let isCardTypeSet = false;
    if (cardType) {
      if (paymentDevice.cardType !== cardType) {
        isCardTypeSet = true;
      }
    }
    //Check is serviceProvider set to update
    let isServiceProviderSet = false;
    if (serviceProvider) {
      if (paymentDevice.serviceProvider !== serviceProvider) {
        isServiceProviderSet = true;
      }
    }
    //Check is billingAddress set to update
    let isBillingAddressSet = false;
    if (billingAddress) {
      if (paymentDevice.billingAddress !== billingAddress) {
        isBillingAddressSet = true;
      }
    }

    console.log("Which values are set to update?");
    console.log(
      "***cardholderName***\nOld value: " +
        paymentDevice.cardholderName +
        "\nNew value: " +
        cardholderName +
        "\nIs set to update: " +
        isCardholderNameSet
    );
    console.log(
      "***lastFourDigits***\nOld value: " +
        paymentDevice.lastFourDigits +
        "\nNew value: " +
        lastFourDigits +
        "\nIs set to update: " +
        isLastFourDigitsSet
    );
    console.log(
      "***expirationDate***\nOld value: " +
        paymentDevice.expirationDate +
        "\nNew value: " +
        expirationDate +
        "\nIs set to update: " +
        isExpirationDateSet
    );
    console.log(
      "***cardType***\nOld value: " +
        paymentDevice.cardType +
        "\nNew value: " +
        cardType +
        "\nIs set to update: " +
        isCardTypeSet
    );
    console.log(
      "***serviceProvider***\nOld value: " +
        paymentDevice.serviceProvider +
        "\nNew value: " +
        serviceProvider +
        "\nIs set to update: " +
        isServiceProviderSet
    );
    console.log(
      "***billingAddress***\nOld value: " +
        paymentDevice.billingAddress +
        "\nNew value: " +
        billingAddress +
        "\nIs set to update: " +
        isBillingAddressSet
    );

    //Attempt to update PaymentDevice with the set data
    const updateResult = await PaymentDeviceRepository.updatePaymentDevice(
      user,
      paymentDevice,
      isCardholderNameSet ? cardholderName : paymentDevice.cardholderName,
      isLastFourDigitsSet ? lastFourDigits : paymentDevice.lastFourDigits,
      isExpirationDateSet ? expirationDate : paymentDevice.expirationDate,
      isCardTypeSet ? cardType : paymentDevice.cardType,
      isServiceProviderSet ? serviceProvider : paymentDevice.serviceProvider,
      isBillingAddressSet ? billingAddress : paymentDevice.billingAddress
    );
    console.log("Was payment device updated? " + updateResult);
    return new ReturnObjectHandler("All test passed", null, 200);
  }
}