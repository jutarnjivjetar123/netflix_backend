import { Request, Response, NextFunction } from "express";

import User from "../models/user.model/user.model";
import UserSession from "../models/user.model/session.model";
import UserService from "../service/user.service/user.service";
import SessionService from "../service/user.service/session.service";

export default class SessionMiddleware {
    public static async (req: Request, res: Response, next: NextFunction) { 
        
        
    }
 }