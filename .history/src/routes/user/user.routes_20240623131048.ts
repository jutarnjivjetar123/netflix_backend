import express from "express";

import User from "models/user.model/email.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserHash from "models/user.model/hash.model";
import UserVerificationToken from "models/user.model/verificationToken.model";

export default class UserRouter {

    public userRouter: express.Router;

    constructor() { 

        this.userRouter = express.Router();

    }

    private routes() { 


    }


    private registerUser(req: express.Request, res: express.Response) { 
        const { }
    }
}
