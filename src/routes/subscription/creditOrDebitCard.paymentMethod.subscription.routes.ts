import { Router, Request, Response } from "express";
import validator from "validator";
import CreditOrDebitCardService from "../../service/subscription.service/creditOrDebitCard.paymentMethod.subscription.service";
class CreditOrDebitCardRouter {
  router = Router();

  /**
   *
   */
  constructor() {
    this.routes();
  }

  routes() {
    //Route for creating a new CreditOrDebitCard for the given User with given PaymentMethod
    this.router.post("", async (req: Request, res: Response) => {
      const {
        userPublicId,
        paymentMethodId,
        cardNumber,
        ccv,
        expiryDate,
        nameOnCard,
        isDefaultOrFirst,
      } = req.body;

      //Data validation for userPublicId
      //Check is userPublicId provided
      if (!userPublicId) {
        return res.status(400).send({
          message: "Public Id must be provided",
          timestamp: new Date(),
        });
      }

      //Check is userPublicId a valid UUID
      if (!validator.isUUID(userPublicId)) {
        return res.status(400).send({
          message: "Public Id is not valid format",
          timestamp: new Date(),
        });
      }

      //Data validation for paymentMethodId
      //Check is paymentMethodId provided
      if (!paymentMethodId) {
        return res.status(400).send({
          message: "Payment method Id must be provided",
          timestamp: new Date(),
        });
      }

      //Check is paymentMethodId a valid UUID
      if (!validator.isUUID(paymentMethodId)) {
        return res.status(400).send({
          message: "Payment method Id is not in valid format",
          timestamp: new Date(),
        });
      }

      //Data validation for cardNumber
      //Check is cardNumber provided
      if (!cardNumber) {
        return res.status(400).send({
          message: "Credit card number must be provided",
          timestamp: new Date(),
        });
      }

      //Check is a valid credit or debit card number
      if (!validator.isCreditCard(cardNumber)) {
        return res.status(400).send({
          message: "A valid credit card number must be provided",
          timestamp: new Date(),
        });
      }

      //Data validation for ccv
      //Check is ccv provided
      if (!ccv) {
        return res.status(400).send({
          message: "CCV must be provided",
          timestamp: new Date(),
        });
      }
      //Check is ccv valid format, 3 or 4 numbers in length
      if (
        !/^[0-9]+$/.test(String(ccv).trim()) ||
        String(ccv).trim().length < 3 ||
        String(ccv).trim().length > 4
      ) {
        return res.status(400).send({
          message: "CCV must be 3 or 4 numeric digits long",
          timestamp: new Date(),
        });
      }
      //Data validation expiry date
      //Check is expiryDate provided
      if (!expiryDate) {
        return res.status(400).send({
          message: "Expiry date must be provided",
          timestamp: new Date(),
        });
      }

      //Check is expiryDate in valid date format and is in UNIX milliseconds timestamp
      if (
        isNaN(Number.parseInt(expiryDate)) ||
        new Date(Number.parseInt(expiryDate)).toString() === "Invalid Date" ||
        Number.parseInt(expiryDate).toString().length !== 13
      ) {
        return res.status(400).send({
          message: "Expiry date must be in UNIX milliseconds format",
          timestamp: new Date(),
        });
      }

      //Check is expiryDate set at least 22 days from current system date,
      //**Reference for 22 days: https://www.getcreditcardnumbers.com/credit-card-glossary read Billing cycle point
      if (
        new Date(new Date().getTime() + 22 * 1000 * 60 * 60 * 24) >
        new Date(Number.parseInt(expiryDate))
      ) {
        return res.status(400).send({
          message:
            "Expiry date cannot be less than 22 days from this date " +
            new Date().toUTCString(),
          timestamp: new Date(),
        });
      }

      //Check has expiryDate already passed
      if (new Date() > new Date(Number.parseInt(expiryDate))) {
        return res.status(400).send({
          message: "Expired card cannot be excepted",
          timestamp: new Date(),
        });
      }

      //Data validation for nameOnCard
      //Check is nameOnCard valid
      //Valid name is considered one with only spaces between the words and being in length between 0 to 26 letters, including 26th one and only those letters of english alphabet

      if (
        String(nameOnCard).trim().length < 0 ||
        String(nameOnCard).trim().length > 26
      ) {
        return res.status(400).send({
          message:
            "Name on the card must be in length between 0 and 26 letters",
          timestamp: new Date(),
        });
      }

      if (
        !/^[A-Za-z\s]+$/.test(String(nameOnCard)) ||
        /\s{2,}/.test(String(nameOnCard))
      ) {
        return res.status(400).send({
          message:
            "Name on card must have only letters from english alphabet (A - Z and a - z), with no other signs except spaces",
        });
      }

      //Data validation for isDefaultOrFirst
      if (isDefaultOrFirst === null || typeof isDefaultOrFirst !== "boolean") {
        return res.status(400).send({
          message: "Option is default card must be specified for the user",
          timestamp: new Date(),
        });
      }

      const createdCreditCard =
        await CreditOrDebitCardService.createCreditOrDebitCard(
          userPublicId,
          paymentMethodId,
          cardNumber,
          ccv,
          expiryDate,
          nameOnCard,
          isDefaultOrFirst
        );

      if (!createdCreditCard.returnValue) {
        return res.status(createdCreditCard.statusCode).send({
          message: createdCreditCard.message,
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        message: "Card successfully saved",
        timestamp: new Date(),
      });
    });
  }
}

export default new CreditOrDebitCardRouter().router;
