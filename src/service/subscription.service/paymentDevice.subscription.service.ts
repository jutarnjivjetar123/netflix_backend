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
    expirationDate: string,
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
    if (Number(expirationDate) <= new Date().getTime()) {
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
      await PaymentDeviceRepository.getPaymentDevicesByUser(user);
    if (paymentDevicesByUser) {
      console.log(paymentDevicesByUser);
      paymentDevicesByUser.forEach((element) => {
        console.log("*****ELEMENT*****");
        console.log("ELEMENT ID: " + element.paymentDeviceId);
        console.log(
          "Billing address: \nElement value: " +
            element.billingAddress +
            "\nNew pd value: " +
            billingAddress +
            "\nIs same: " +
            (element.billingAddress === billingAddress)
        );
        console.log(
          "Card type: \nElement value: " +
            element.cardType +
            "\nNew pd value: " +
            cardType +
            "\nIs same: " +
            (element.cardType === cardType)
        );
        console.log(
          "Cardholder name: \nElement value: " +
            element.cardholderName +
            "\nNew pd value: " +
            cardholderName +
            "\nIs same: " +
            (element.cardholderName === cardholderName)
        );
        console.log(
          "Expiration date: \nElement value: " +
            element.expirationDate +
            "\nNew pd value: " +
            expirationDate +
            "\nIs same: " +
            (element.expirationDate === expirationDate)
        );
        console.log(
          "Last four digits: \nElement value: " +
            element.lastFourDigits +
            "\nNew pd value: " +
            lastFourDigits +
            "\nIs same: " +
            (element.lastFourDigits === lastFourDigits)
        );
        console.log(
          "Service provider: \nElement value: " +
            element.serviceProvider +
            "\nNew pd value: " +
            serviceProvider +
            "\nIs same: " +
            (element.serviceProvider === serviceProvider)
        );

        console.log(
          "Is new payment device same as the current? " +
            (element.billingAddress === billingAddress &&
              element.cardType === cardType &&
              element.cardholderName === cardholderName &&
              element.expirationDate === expirationDate &&
              element.lastFourDigits === lastFourDigits &&
              element.serviceProvider === serviceProvider)
        );
      });
      const isDuplicate = paymentDevicesByUser.some((element) => {
        return (
          element.billingAddress === billingAddress &&
          element.cardType === cardType &&
          element.cardholderName === cardholderName &&
          element.expirationDate === expirationDate &&
          element.lastFourDigits === lastFourDigits &&
          element.serviceProvider === serviceProvider
        );
      });

      if (isDuplicate) {
        return new ReturnObjectHandler(
          "Payment device with the same details already exists",
          null,
          409
        );
      }
    }
    const isDefault = paymentDevicesByUser ? false : true;
    //Attempt to create a PaymentDevice object in relation with given User relation
    const paymentDevice = await PaymentDeviceRepository.createPaymentDevice(
      user,
      cardholderName,
      lastFourDigits,
      expirationDate,
      cardType,
      serviceProvider,
      billingAddress,
      isDefault
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
    expirationDate?: string,
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

  //Get all PaymentDevice objects associated with User
  public static async getAllPaymentDeviceByUser(user: User) {
    const paymentDevices =
      await PaymentDeviceRepository.getDefaultPaymentDeviceByUser(user);
    if (!paymentDevices) {
      return new ReturnObjectHandler(
        "No PaymentDevice associated with User was found",
        null,
        404
      );
    }
    return new ReturnObjectHandler(
      "Found " + paymentDevices.length + " PaymentDevice object's for User",
      paymentDevices,
      200
    );
  }

  //Get PaymentDevice with isDefault attribute set to true associated with given User
  public static async getDefaultPaymentDeviceByUser(user: User) {
    const defaultPaymentDevice =
      await PaymentDeviceRepository.getDefaultPaymentDeviceByUser(user);
    if (!defaultPaymentDevice) {
      return new ReturnObjectHandler(
        "Please select one of the payment devices as the default one",
        null,
        404
      );
    }
    return new ReturnObjectHandler(
      "Default payment device found",
      defaultPaymentDevice,
      200
    );
  }

  //Attempt to remove PaymentDevice provided in the parameter of the function, returns ReturnObjectHandler with appropriate values (null if failed, removed object if operation succeed)
  public static async removePaymentDevice(paymentDevice: PaymentDevice) {
    const isRemoved = await PaymentDeviceRepository.removePaymentDevice(
      paymentDevice
    );

    if (!isRemoved) {
      return new ReturnObjectHandler(
        "Payment device was not deleted",
        null,
        400
      );
    }
    return new ReturnObjectHandler(
      "Successfully removed payment device",
      paymentDevice,
      200
    );
  }
}
