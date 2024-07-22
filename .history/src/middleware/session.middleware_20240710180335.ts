import { Request, Response, NextFunction } from "express";

import User from "../models/"
export default class SessionMiddleware {
    public static async authenticateSession(req: Request, res: Response, next: NextFunction) { 
        const doesUserHaveActiveSession = 
    }
 }