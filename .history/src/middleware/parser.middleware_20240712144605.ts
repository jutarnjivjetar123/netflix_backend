import { Request, Response, NextFunction } from "express";
import validator, { isNumeric } from "validator";

import { PhoneNumberHelper } from "../helpers/phoneNumber.helpers";
import DataSanitation from "../helpers/sanitation.helpers";
import { FaWineGlassEmpty } from "react-icons/fa6";

export default class DataParserMiddleware {
  public static parseLoginDataWithEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        successState: false,
        message: "Email must be provided",
        timestamp: new Date(),
      });
    }
    if (!password) {
      return res.status(400).send({
        successState: false,
        message: "Password must be provided",
        timestamp: new Date(),
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        successState: false,
        message:
          "Provided email address cannot be considered a valid email address format",
        timestamp: new Date(),
      });
    }
    next();
  }
  public static parseLoginDataWithPhoneNumber()
}