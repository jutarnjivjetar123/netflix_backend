import User from "../models/user.model/user.model";
import UserEmail from "../models/user.model/email.model";
import UserPassword from "../models/user.model/password.model";
import UserSalt from "../models/user.model/salt.model";
import UserPhoneNumber from "../models/user.model/phone.model";

import UserService from "../service/user.service/user.service";

import { Request, Response, NextFunction } from "express";

export default class UserMiddleware { 
    public async authenticateUserWithEmail(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const doesUserExist = await UserService.checkDoesUserExistWithEmail(email);
        if(!doesUserExist.returnValue)
     }
}