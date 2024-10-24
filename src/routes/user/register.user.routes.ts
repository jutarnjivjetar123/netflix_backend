import { Router, Request, Response } from "express";

import UserService from "../../service/user.service/register.user.service";
import UserRegisterService from "../../service/user.service/register.user.service";
import SubscriptionService from "service/subscription.service/subscription.subscription.service";
import validator from "validator";

//IMPORTANT NOTICE:
/*
    THIS DOCUMENT ONLY CONTAINS ROUTES TO THE FUNCTIONS, DOES NOT HANDLE ERROR OR ANY OTHER KIND OF DATA MANIPULATION AND PROCESSING
*/
class RegisterRouter {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    //Check is the router active
    this.router.get("/check", (req: Request, res: Response) => {
      return res.status(200).send({
        successState: true,
        message: "Register router established",
        timestamp: new Date().getTime(),
      });
    });

    //Route for new User registration along with creating UserEmail, UserPhoneNumber, UserPassword
    this.router.post("/create", async (req: Request, res: Response) => {
      const { email, countryCode, phoneNumber, password } = req.body;
      if (!email && (!countryCode || !phoneNumber)) {
        return res.status(400).send({
          message: "Email or phone number with country code is required",
          timestamp: new Date(),
        });
      }
      if (!password) {
        return res.status(400).send({
          message: "Password is required",
          timestamp: new Date(),
        });
      }
      const registrationResult = await UserService.registerUser(
        email,
        countryCode,
        phoneNumber,
        password
      );
      if (registrationResult.statusCode !== 200) {
        return res.status(registrationResult.statusCode).send({
          message: registrationResult.message,
          timestamp: new Date(),
        });
      }
      return res.status(registrationResult.statusCode).send({
        message: registrationResult.message,
        publicId: registrationResult.returnValue,
        redirectLink: "http://localhost:5501/src/signup/offer.html",
        timestamp: new Date(),
      });
    });

    this.router.post("/complete", async (req: Request, res: Response) => {
      const { publicId } = req.body;
      if (!publicId) {
        return res.status(400).send({
          message: "Public Id must be provided",
          timestamp: new Date(),
        });
      }

      const registrationData =
        await UserService.getRegistrationDataByUserPublicId(publicId);
      if (registrationData.statusCode !== 200) {
        return res.status(registrationData.statusCode).send({
          message: registrationData.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        message: "Signup confirmation pending",
        registrationData: registrationData.returnValue,
        timestamp: new Date(),
      });
    });

    this.router.post("/confirm", async (req: Request, res: Response) => {
      const { publicId, confirmationStatus } = req.body;
      if (!publicId) {
        return res.status(400).send({
          message: "Public identification is required",
          timestamp: new Date(),
        });
      }

      if (typeof confirmationStatus !== "boolean") {
        return res.status(400).send({
          message: "Confirmation status is required",
          timestamp: new Date(),
        });
      }

      if (!confirmationStatus) {
        const isRegistrationDataDismissed =
          await UserRegisterService.dismissRegistrationByPublicId(publicId);
        if (!isRegistrationDataDismissed.returnValue) {
          return res.status(isRegistrationDataDismissed.statusCode).send({
            message: isRegistrationDataDismissed.message,
            timestamp: new Date(),
          });
        }
        return res.status(200).send({
          message: isRegistrationDataDismissed.message,
          timestamp: new Date(),
        });
      }

      //Attempt to active Subscription
      const isUpdated =
        await UserRegisterService.activateSubscriptionByPublicId(publicId);

      if (isUpdated.statusCode !== 200) {
        return res.status(isUpdated.statusCode).send({
          message: isUpdated.message,
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        message: isUpdated.message,
        timestamp: new Date(),
      });
    });
    this.router.post("/code/send", async (req: Request, res: Response) => {
      const { publicId } = req.body;
      if (!publicId) {
        return res.status(400).send({
          message: "Public identification is required",
          timestamp: new Date(),
        });
      }
      if (!validator.isUUID(publicId)) {
        return res.status(400).send({
          message: "Public identification invalid",
          timestamp: new Date(),
        });
      }
      const isConfirmationCodeGenerated =
        await UserRegisterService.generateConfirmationCodeByPublicId(publicId);
      if (isConfirmationCodeGenerated.statusCode !== 200) {
        return res.status(isConfirmationCodeGenerated.statusCode).send({
          message: isConfirmationCodeGenerated.message,
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        message: "Confirmation code sent, please check your email",
        timestamp: new Date(),
      });
    });
    this.router.post("/code/verify", async (req: Request, res: Response) => {
      const { confirmationCode, publicId } = req.body;
      if (!confirmationCode) {
        return res.status(400).send({
          message: "Confirmation code is required",
          timestamp: new Date(),
        });
      }
      if (
        !validator.isNumeric(confirmationCode) ||
        (confirmationCode as string).length !== 6
      ) {
        return res.status(400).send({
          message: "Confirmation code is in invalid format",
          timestamp: new Date(),
        });
      }
      if (!publicId) {
        return res.status(400).send({
          message: "Public identification is required",
          timestamp: new Date(),
        });
      }
      if (!validator.isUUID(publicId)) {
        return res.status(400).send({
          message: "Public identification is invalid",
          timestamp: new Date(),
        });
      }

      //Verify is confirmationCode valid against the one in the database

      const verificationProcessResult =
        await UserRegisterService.verifyConfirmationCodeByPublicId(
          publicId,
          confirmationCode
        );
      return res.status(verificationProcessResult.statusCode).send({
        message: verificationProcessResult.message,
        isConfirmed: verificationProcessResult.returnValue,
        timestamp: new Date(),
      });
    });
  }
}

export default new RegisterRouter().router;
