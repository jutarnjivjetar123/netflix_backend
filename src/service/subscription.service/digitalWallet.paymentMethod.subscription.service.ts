import UserService from "../../service/user.service/main.user.service";
import DigitalWallet from "../../models/subscription.model/digitalWallet.paymentMethod.model";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import validator from "validator";
import PaymentMethodService from "./paymentMethod.subscription.service";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
import DigitalWalletRepository from "../../repository/subscription/digitalWallet.paymentMethod.subscription.repository";
import CreditOrDebitCardService from "./creditOrDebitCard.paymentMethod.subscription.service";
export default class DigitalWalletService {
  public static async createDigitalWallet(
    userPublicId: string,
    paymentMethodId: string,
    walletId: string,
    useRegistrationEmail: boolean = true,
    email: string = null,
    walletLink: string,
    isDefaultOrFirst: boolean = false
  ): Promise<ReturnObjectHandler<DigitalWallet>> {
    //Data validation for userPublicId
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        400
      );
    }

    //Data validation for paymentMethodId
    if (!validator.isUUID(paymentMethodId)) {
      return new ReturnObjectHandler(
        "Payment method identification is not valid",
        null,
        400
      );
    }

    //Data validation for email if useRegistrationEmail is set to false
    if (!useRegistrationEmail) {
      if (!email) {
        return new ReturnObjectHandler(
          "Email address must be provided",
          null,
          400
        );
      }
      if (!validator.isEmail(email)) {
        return new ReturnObjectHandler("Email address is not valid", null, 400);
      }
    }

    //Data validation for URL linked to wallet
    if (!walletLink) {
      return new ReturnObjectHandler("Wallet link must be provided", null, 400);
    }

    if (!validator.isURL(walletLink)) {
      return new ReturnObjectHandler(
        "Wallet link is not a valid URL",
        null,
        400
      );
    }

    //Get User by userPublicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get PaymentMethod by paymentMethodId
    const paymentMethod = await PaymentMethodService.getPaymentMethodById(
      paymentMethodId
    );
    if (!paymentMethod.returnValue) {
      return new ReturnObjectHandler("Payment method not found", null, 404);
    }

    //Check is found payment method a type of DigitalWallet
    if (paymentMethod.returnValue.type !== PaymentMethodTypes.DIGITAL_WALLET) {
      return new ReturnObjectHandler(
        "Payment method must be for digital wallet",
        null,
        400
      );
    }

    let userEmail;
    //Check did user use email to signup if the useRegistrationEmail value is set to true
    if (useRegistrationEmail) {
      if (!user.usedEmailToSignUp) {
        return new ReturnObjectHandler(
          "Registration email not available",
          null,
          400
        );
      }

      //Get UserEmail for the given User
      const userEmailTemp = await UserService.getUserEmailByUser(user);

      if (!userEmailTemp) {
        return new ReturnObjectHandler(
          "Registration email not available",
          null,
          404
        );
      }

      userEmail = userEmailTemp.email;
    }

    //Get all DigitalWallet objects linked with the given User
    const allDigitalWalletsByUser =
      await DigitalWalletRepository.getAllDigitalWalletsByUser(user);

    if (allDigitalWalletsByUser.length > 0) {
      //Check does User already have a DigitalWallet set as default
      if (isDefaultOrFirst) {
        if (allDigitalWalletsByUser.find((wallet) => wallet.isDefaultForUser)) {
          return new ReturnObjectHandler(
            "User already has a default payment device",
            null,
            400
          );
        }
      }

      //Check does User already have a DigitalWallet object linked with them with the same paymentMethodId and walletId
      if (
        allDigitalWalletsByUser.find(
          (wallet) =>
            wallet.walletId === walletId &&
            wallet.paymentMethod.paymentMethodId === paymentMethodId
        )
      ) {
        return new ReturnObjectHandler(
          "Digital wallet already registered",
          null,
          400
        );
      }
    }

    //Check does User already have a CreditOrDebitCard object set as default linked with them
    const allCreditOrDebitCardsByUser =
      await CreditOrDebitCardService.getAllCreditOrDebitCardsByUser(user);

    if (
      allCreditOrDebitCardsByUser.returnValue.length > 0 &&
      isDefaultOrFirst
    ) {
      if (
        allCreditOrDebitCardsByUser.returnValue.find(
          (card) => card.isDefaultForUser
        )
      ) {
        return new ReturnObjectHandler(
          "User already has a default payment device",
          null,
          400
        );
      }
    }

    let emailToUse = email;
    if (useRegistrationEmail === true) {
      emailToUse = userEmail;
      console.log("Email is being used");
    }

    console.log("Given email:" + email);
    console.log("User email: " + userEmail);
    console.log("Is registration email used: " + useRegistrationEmail);
    console.log("Email to use: " + emailToUse);
    //Attempt to create new DigitalWallet
    const newDigitalWallet = new DigitalWallet();
    newDigitalWallet.walletId = walletId;
    newDigitalWallet.user = user;
    newDigitalWallet.paymentMethod = paymentMethod.returnValue;
    newDigitalWallet.isDefaultForUser = isDefaultOrFirst;
    newDigitalWallet.walletLink = walletLink;
    newDigitalWallet.email = emailToUse;
    newDigitalWallet.createdAt = new Date().getTime().toString();

    console.log("Used email: " + newDigitalWallet.email);
    const newDigitalWalletCreated =
      await DigitalWalletRepository.createDigitalWallet(newDigitalWallet);

    if (!newDigitalWallet) {
      return new ReturnObjectHandler(
        "Failed to create digital wallet",
        null,
        400
      );
    }

    return new ReturnObjectHandler(
      "Digital wallet created",
      newDigitalWalletCreated,
      200
    );
  }
}
