"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = __importDefault(require("../../service/user.service/user.service"));
const uuid_1 = require("uuid");
class UserRouter {
    router;
    constructor() {
        this.router = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.router.post("/register", this.registerUser);
    }
    async registerUser(req, res) {
        const { email, phoneNumber, password, firstName, lastName, username } = req.body;
        if (email && !phoneNumber) {
            const doesUserExist = await user_service_1.default.checkDoesUserExistWithEmail(email);
            if (doesUserExist.returnValue) {
                return res.status(400).send({
                    successState: false,
                    message: "Email " + email + " taken",
                    timestamp: new Date(),
                });
            }
            const newUser = await user_service_1.default.createNewUserByEmail(firstName, lastName, username, email, password);
            if (!newUser.returnValue) {
                return res.status(400).send({
                    successState: false,
                    message: newUser.message,
                    timestamp: new Date(),
                });
            }
            return res.status(200).send({
                successState: true,
                message: "Successfully created new user with email: " + email,
                returnData: {
                    userData: {
                        username: newUser.returnValue.userObject.username,
                        firstName: newUser.returnValue.userObject.firstName,
                        lastName: newUser.returnValue.userObject.lastName,
                    },
                    emailData: {
                        email: newUser.returnValue.emailObject.email,
                    },
                    passwordData: {
                        id: (0, uuid_1.v4)(),
                    },
                },
                timestamp: new Date(),
            });
        }
        if (phoneNumber && !email) {
            //function to check does user with given phone number exist
            console.log(new Date() +
                " -> UserRoutes::registerUser::phoneNumber parameter has value of: " +
                phoneNumber +
                " and type: " +
                typeof phoneNumber);
            const newUser = await user_service_1.default.registerUserWithPhoneNumber(firstName, lastName, username, phoneNumber, password);
            if (!newUser.returnValue) {
                return res.status(400).send({
                    successState: false,
                    message: newUser.message,
                    timestamp: new Date(),
                });
            }
            return res.status(200).send({
                successState: true,
                message: "Successfully created new user with phone number: " + phoneNumber,
                returnData: {
                    user: {
                        username: newUser.returnValue.user.username,
                        firstName: newUser.returnValue.user.firstName,
                        lastName: newUser.returnValue.user.lastName,
                        phoneNumber: newUser.returnValue.phoneNumber.phoneNumber,
                    },
                },
                timestamp: new Date(),
            });
        }
    }
}
exports.default = new UserRouter().router;
//# sourceMappingURL=user.routes.js.map