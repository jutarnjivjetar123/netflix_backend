import { Request, Response, Router } from "express";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";
import PaymentDeviceService from "../../service/subscription.service/paymentDevice.subscription.service";
import validator from "validator";
class PaymentDeviceRouter {
  router = Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.post("/save", async (req: Request, res: Response) => {
      const {
        userPublicId,
        cardholderName,
        lastFourDigits,
        expirationDate,
        cardType,
        serviceProvider,
        billingAddress,
      } = req.body;
      if (!validator.isUUID(userPublicId)) {
        return res.status(400).send({
          message: "Identification must be provided",
          timestamp: new Date(),
        });
      }
      if (!cardholderName) {
        return res.status(400).send({
          message: "Cardholder name must be provided",
          timestamp: new Date(),
        });
      }

      if (!lastFourDigits) {
        return res.status(400).send({
          message: "Last four digits on the back must be provided",
          timestamp: new Date(),
        });
      }

      if (String(lastFourDigits).length !== 4) {
        return res.status(400).send({
          message: "Last four digits must have 4 digits",
          timestamp: new Date(),
        });
      }
      if (!expirationDate) {
        return res.status(400).send({
          message: "Expiration date must be provided",
          timestamp: new Date(),
        });
      }

      if (new Date(expirationDate) <= new Date()) {
        return res.status(400).send({
          message: "Already expired card's cannot be accepted",
          timestamp: new Date(),
        });
      }

      if (typeof cardType !== "boolean") {
        return res.status(400).send({
          message: "Card type can only be set as debit or credit",
          timestamp: new Date(),
        });
      }
      if (!serviceProvider) {
        return res.status(400).send({
          message: "Service provider must be provided",
          timestamp: new Date(),
        });
      }
      if (!billingAddress) {
        return res.status(400).send({
          message: "Billing address must be provided",
          timestamp: new Date(),
        });
      }
      const paymentDevice = await PaymentDeviceService.createPaymentDevice(
        userPublicId,
        cardholderName,
        lastFourDigits,
        expirationDate,
        cardType,
        serviceProvider,
        billingAddress
      );

      if (paymentDevice.statusCode !== 200) {
        return res.status(paymentDevice.statusCode).send({
          message: paymentDevice.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        message: paymentDevice.getMessage(),
        timestamp: new Date(),
      });
    });
    this.router.post("/update", async (req: Request, res: Response) => {
      try {
        const {
          userPublicId,
          paymentDeviceId,
          cardholderName,
          lastFourDigits,
          expirationDate,
          cardType,
          serviceProvider,
          billingAddress,
        } = req.body;

        //Check is provided userPublicId valid
        if (!userPublicId) {
          return res.status(400).send({
            message: "Public Id must be provided",
            timestamp: new Date(),
          });
        }
        if (!validator.isUUID(userPublicId)) {
          return res.status(400).send({
            message: "Public Id must be in valid format",
            timestamp: new Date(),
          });
        }

        //Check is paymentDeviceId provided and valid
        if (!paymentDeviceId) {
          return res.status(400).send({
            message: "Payment device identification must be provided",
            timestamp: new Date(),
          });
        }
        if (!validator.isUUID(paymentDeviceId)) {
          return res.status(400).send({
            message:
              "Provided payment device identification cannot be considered valid",
            timestamp: new Date(),
          });
        }
        //Check does any parameter exist
        if (
          !cardholderName &&
          !lastFourDigits &&
          !expirationDate &&
          !cardType &&
          !serviceProvider &&
          !billingAddress
        ) {
          return res.status(400).send({
            message:
              "At least one attribute of the payment device must be set to update",
            timestamp: new Date(),
          });
        }

        //Individual parameter validity checking
        //Test is lastFourDigits parameter four characters in length
        if (lastFourDigits && String(lastFourDigits).length !== 4) {
          return res.status(400).send({
            message: "Last four digits must have 4 digits",
            timestamp: new Date(),
          });
        }

        //Check has the new expiration date already passed
        if (expirationDate && new Date(expirationDate) <= new Date()) {
          return res.status(400).send({
            message:
              "Cannot set expiry date as the one that had already passed",
            timestamp: new Date(),
          });
        }

        //Check is the card type boolean (true - credit | false - debit)
        if (cardType && typeof cardType !== "boolean") {
          return res.status(400).send({
            message: "Card type can only be set as debit or credit",
            timestamp: new Date(),
          });
        }

        //Attempt to update PaymentDevice
        const updateResult = await PaymentDeviceService.updatePaymentDevice(
          userPublicId,
          paymentDeviceId,
          cardholderName,
          lastFourDigits,
          expirationDate,
          cardType,
          serviceProvider,
          billingAddress
        );

        if (updateResult.statusCode !== 200) {
          return res.status(updateResult.statusCode).send({
            message: updateResult.message,
            timestamp: new Date(),
          });
        }
        return res.status(200).send({
          message: "All tests passed",
          timestamp: new Date(),
        });
      } catch (error) {
        return res.status(500).send({
          message: error.message,
          timestamp: new Date(),
        });
      }
    });
  }
}
export default new PaymentDeviceRouter().router;
