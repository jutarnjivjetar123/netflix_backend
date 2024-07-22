import { Request, Response, NextFunction } from "express";
import validator, { isNumeric } from "validator";

import { PhoneNumberHelper } from "../helpers/phoneNumber.helpers";
import DataSanitation from "../helpers/sanitation.helpers";

export default class DataRouteParser { 
    public static parseLoginDataWithEmail(req: Request, res: Response, next: NextFunction) { 
        const { email, password } = req.body;
        if (!email) { 
            return res.status()
        }
    }
}