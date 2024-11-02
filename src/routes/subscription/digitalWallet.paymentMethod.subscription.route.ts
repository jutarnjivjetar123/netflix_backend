import { Router, Request, Response } from "express";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
import validator from "validator";
import DigitalWalletService from "../../service/subscription.service/digitalWallet.paymentMethod.subscription.service";

class DigitalWalletRouter {
  router = Router();

  constructor() {
    this.routes();
  }
  routes() {
    this.router.post("", async (req: Request, res: Response) => {
      const {
        userPublicId,
        paymentMethodId,
        walletId,
        useRegistrationEmail,
        email,
        walletLink,
        isDefaultOrFirst,
      } = req.body;

      //Data validation for userPublicId
      if (!userPublicId) {
        return res.status(400).send({
          message: "Public identification must be provided",
          timestamp: new Date(),
        });
      }
      if (!validator.isUUID(userPublicId)) {
        return res.status(400).send({
          message: "Public identification format not valid",
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

      //Date validation for walletId

      //Check is walletId provided
      if (!walletId) {
        return res.status(400).send({
          message: "Wallet Id must be provided",
          timestamp: new Date(),
        });
      }

      //Data validation for userRegistrationEmail and email

      //useRegistrationEmail is a field that lets the system know is the email address linked to the wallet the one the user used to register or the one provided in the email field

      //If useRegistrationEmail is set to false, it means that the user will provide email
      if (
        !useRegistrationEmail ||
        useRegistrationEmail === false ||
        String(useRegistrationEmail) === "false"
      ) {
        //Check is email provided
        if (!email) {
          return res.status(400).send({
            message: "Email must be provided",
            timestamp: new Date(),
          });
        }

        //Check is valid email
        if (!validator.isEmail(email)) {
          return res.status(400).send({
            message: "Email address is not a valid email address",
            timestamp: new Date(),
          });
        }
      }

      //Data validation for walletLink
      //Check is walletLink provided
      if (!walletLink) {
        return res.status(400).send({
          message: "URL to wallet must be provided",
          timestamp: new Date(),
        });
      }

      //Check is walletLink a valid URL
      if (!validator.isURL(walletLink)) {
        return res.status(400).send({
          message: "Given URL to wallet is not a valid URL",
          timestamp: new Date(),
        });
      }

      //Try to create a new Digital Wallet
      const digitalWalletCreationResult =
        await DigitalWalletService.createDigitalWallet(
          userPublicId,
          paymentMethodId,
          walletId,
          useRegistrationEmail,
          email,
          walletLink,
          isDefaultOrFirst
        );
      if (!digitalWalletCreationResult.returnValue) {
        return res.status(digitalWalletCreationResult.statusCode).send({
          message: digitalWalletCreationResult.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        message: "Digital wallet saved",
        timestamp: new Date(),
      });
    });
  }
}

export default new DigitalWalletRouter().router;
