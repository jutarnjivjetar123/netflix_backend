import UserService from "../../service/user.service/main.user.service";
import CreditOrDebitCard from "../../models/subscription.model/creditOrDebitCard.paymentMethod.subscription.model";
import CreditOrDebitCardRepository from "../../repository/subscription/creditOrDebitCard.repository";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import validator from "validator";
import PaymentMethodService from "./paymentMethod.subscription.service";
import PaymentMethod from "../../models/subscription.model/paymentMethod.model";
import User from "../../models/user.model/user.model";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
export default class CreditOrDebitCardService {
  //Create new CreditOrDebitCard object with given data
  public static async createCreditOrDebitCard(
    userPublicId: string,
    paymentMethodId: string,
    cardNumber: string,
    ccv: number,
    expiryDate: string,
    nameOnCard: string,
    isDefaultOrFirst: boolean
  ) {
    //Data validation for provided parameters
    //Check is userPublicId valid UUID
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public Id is not valid format",
        null,
        400
      );
    }

    //Check paymentMethodId a valid UUID
    if (!validator.isUUID(paymentMethodId)) {
      return new ReturnObjectHandler(
        "Payment method Id is not valid format",
        null,
        400
      );
    }

    //Check is a valid credit or debit card number
    if (!validator.isCreditCard(cardNumber)) {
      return new ReturnObjectHandler(
        "Payment method Id is not valid format",
        null,
        400
      );
    }

    //Check is ccv in valid format, 3 or 4 numerical digits in length
    if (
      !/^[0-9]+$/.test(String(ccv).trim()) ||
      String(ccv).trim().length < 3 ||
      String(ccv).trim().length > 4
    ) {
      return new ReturnObjectHandler(
        "CCV must be 3 to 4 numbers long",
        null,
        400
      );
    }

    //Check is expiryDate in valid date format and is in UNIX milliseconds timestamp
    if (
      isNaN(Number.parseInt(expiryDate)) ||
      new Date(Number.parseInt(expiryDate)).toString() === "Invalid Date" ||
      Number.parseInt(expiryDate).toString().length !== 13
    ) {
      return new ReturnObjectHandler(
        "Expiry date must be in UNIX milliseconds format",
        null,
        400
      );
    }

    //Check is expiryDate set at least 22 days from current system date,
    //**Reference for 22 days: https://www.getcreditcardnumbers.com/credit-card-glossary read Billing cycle point
    if (
      new Date(new Date().getTime() + 22 * 1000 * 60 * 60 * 24) >
      new Date(Number.parseInt(expiryDate))
    ) {
      return new ReturnObjectHandler(
        "Expiry date cannot be less than 22 days from this date " +
          new Date().toUTCString(),
        null,
        400
      );
    }

    //Check has expiryDate already passed
    if (new Date() > new Date(Number.parseInt(expiryDate))) {
      return new ReturnObjectHandler(
        "Expired card cannot be excepted",
        null,
        400
      );
    }

    //Check is nameOnCard valid
    //Valid name is considered one with only spaces between the words and being in length between 0 to 26 letters, including 26th one and only those letters of english alphabet

    if (
      String(nameOnCard).trim().length < 0 ||
      String(nameOnCard).trim().length > 26
    ) {
      return new ReturnObjectHandler(
        "Name on the card must be in length between 0 and 26 letters",
        null,
        400
      );
    }

    if (
      !/^[A-Za-z\s]+$/.test(String(nameOnCard)) ||
      /\s{2,}/.test(String(nameOnCard))
    ) {
      return new ReturnObjectHandler(
        "Name on card must have only letters from english alphabet (A - Z and a - z), with no other signs except spaces",
        null,
        400
      );
    }

    //Get the User by public Id, simultaneously checking does user exist
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User does not exist", null, 404);
    }

    //Get the PaymentMethod by Id
    const paymentMethod = await PaymentMethodService.getPaymentMethodById(
      paymentMethodId
    );
    if (!paymentMethod.returnValue) {
      return paymentMethod;
    }

    //Check is the payment method type one meant for the credit or debit card (enum CreditOrDebitCard)
    if (
      paymentMethod.returnValue.type !== PaymentMethodTypes.CREDIT_DEBIT_CARD
    ) {
      return new ReturnObjectHandler(
        "Payment method type not valid",
        null,
        400
      );
    }
    //Check does User have an existing card with the same data (CCV and Card number and nameOnTheBack)
    const userExistingCards =
      await CreditOrDebitCardRepository.getCreditOrDebitCardsByUser(user);
    if (userExistingCards.length > 0) {
      for (const card of userExistingCards) {
        if (card.cardNumber === cardNumber) {
          return new ReturnObjectHandler("Card already exists", null, 400);
        }
        if (card.ccv === ccv) {
          return new ReturnObjectHandler("Card already exists", null, 400);
        }
        if (isDefaultOrFirst && card.isDefaultForUser) {
          return new ReturnObjectHandler(
            "There is already a card set as default",
            null,
            400
          );
        }
      }
    }

    //Create new CreditOrDebitCard object
    const newCard = new CreditOrDebitCard();
    newCard.cardNumber = cardNumber;
    newCard.ccv = ccv;
    newCard.expiryDate = expiryDate;
    newCard.isDefaultForUser = isDefaultOrFirst;
    newCard.nameOnCard = nameOnCard;
    newCard.paymentMethod = paymentMethod.returnValue;
    newCard.user = user;
    const savedResult =
      await CreditOrDebitCardRepository.createNewCreditOrDebitCard(newCard);
    if (!savedResult) {
      return new ReturnObjectHandler(
        "Failed to save credit or debit card",
        null,
        500
      );
    }
    return new ReturnObjectHandler("New card saved", userPublicId, 200);
  }

  public static async getAllCreditOrDebitCardsByUser(
    user: User
  ): Promise<ReturnObjectHandler<CreditOrDebitCard[]>> {
    const creditOrDebitCards =
      await CreditOrDebitCardRepository.getCreditOrDebitCardsByUser(user);
    if (creditOrDebitCards === null) {
      return new ReturnObjectHandler(
        "Failed to get credit or debit cards",
        null,
        500
      );
    }

    if (creditOrDebitCards.length === 0) {
      return new ReturnObjectHandler(
        "No credit or debit cards found",
        null,
        404
      );
    }

    return new ReturnObjectHandler(
      "Credit or debit cards found",
      creditOrDebitCards,
      200
    );
  }
}
