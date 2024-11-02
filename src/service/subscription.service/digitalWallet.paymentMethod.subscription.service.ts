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

    if (isDefaultOrFirst) {
      //Check if the user already has a default payment method
      const digitalWalletsByUser =
        await DigitalWalletRepository.getAllDigitalWalletsByUser(user);
      if (digitalWalletsByUser.length > 0) {
        //Check if the user already has a default payment method
        if (
          digitalWalletsByUser.find(
            (digitalWallet) => digitalWallet.isDefaultForUser
          )
        ) {
          return new ReturnObjectHandler(
            "User already has a default payment method",
            null,
            400
          );
        }
      }

      const creditOrDebitCardsByUser =
        await CreditOrDebitCardService.getAllCreditOrDebitCardsByUser(user);

      if (creditOrDebitCardsByUser.returnValue.length > 0) {
        //Check if the user already has a default payment method
        if (
          creditOrDebitCardsByUser.returnValue.find(
            (creditOrDebitCard) => creditOrDebitCard.isDefaultForUser
          )
        ) {
          return new ReturnObjectHandler(
            "User already has a default payment method",
            null,
            400
          );
        }
      }

      //Check does the User already have a DigitalWallet with the same walletId issued by the same provider
      if (
        digitalWalletsByUser.find(
          (digitalWallet) =>
            digitalWallet.walletId === walletId &&
            digitalWallet.paymentMethod.paymentMethodId === paymentMethodId
        )
      ) {
        return new ReturnObjectHandler(
          "User has already the same digital wallet",
          null,
          400
        );
      }
    }
    //Attempt to create new DigitalWallet
    const newDigitalWallet = new DigitalWallet();
    newDigitalWallet.walletId = walletId;
    newDigitalWallet.user = user;
    newDigitalWallet.paymentMethod = paymentMethod.returnValue;
    newDigitalWallet.isDefaultForUser = isDefaultOrFirst;
    newDigitalWallet.walletLink = walletLink;
    newDigitalWallet.email = useRegistrationEmail ? userEmail : email;
    newDigitalWallet.createdAt = new Date().getTime().toString();

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
