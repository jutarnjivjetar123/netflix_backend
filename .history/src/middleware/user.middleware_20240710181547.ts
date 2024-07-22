import User from "../models/user.model/user.model";
import UserEmail from "../models/user.model/email.model";
import UserPassword from "../models/user.model/password.model";
import UserSalt from "../models/user.model/salt.model";
import UserPhoneNumber from "../models/user.model/phone.model";

import UserService from "../service/user.service/user.service";

export default class UserMiddleware { 
    public async authenticateUserWithEmail() { }
}