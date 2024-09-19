import { Router, Request, Response } from "express";

import UserService from "../../service/user.service/register.user.service";
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
        redirectLink: "http://localhost:5005/signup/payment",
        timestamp: new Date(),
      });
    });
  }
}

export default new RegisterRouter().router;
