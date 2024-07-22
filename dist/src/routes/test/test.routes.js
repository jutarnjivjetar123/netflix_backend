"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const phoneNumber_helpers_1 = require("../../helpers/phoneNumber.helpers");
const user_service_1 = __importDefault(require("../../service/user.service/user.service"));
class DevRouter {
    router;
    constructor() {
        this.router = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.router.post("/getPhoneNum", this.checkUserPhoneNumber);
        this.router.post("/register", this.createNewUserPhoneNumber);
        this.router.get("/user/all/phoneNumber", this.getUserByPhoneNumber);
    }
    async checkUserPhoneNumber(req, res) {
        const { phoneNumber } = req.body;
        try {
            const returnValue = phoneNumber_helpers_1.PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
            if (typeof returnValue !== "string") {
                return res.status(200).send({
                    message: "Successfully parsed phone number",
                    phoneNumber: returnValue.getNationalNumber().toString(),
                    countryCode: returnValue.getCountryCode().toString(),
                });
            }
            return res.status(200).send({
                message: "Successfully parsed phone number",
                phoneNumber: returnValue,
                countryCode: null,
            });
        }
        catch (error) {
            return res.status(400).send({
                message: error.message,
                phoneNumber: null,
                countryCode: null,
            });
        }
    }
    checkIsValidPhoneNumber(req, res) { }
    async createNewUserPhoneNumber(req, res) {
        const { phoneNumber, password } = req.body;
    }
    async getUserByPhoneNumber(req, res) {
        const { phoneNumber } = req.body;
        let parsedPhoneNumber;
        try {
            parsedPhoneNumber =
                phoneNumber_helpers_1.PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
        }
        catch (error) {
            return res.status(400).send({
                message: error.message,
                phoneNumber: null,
                countryCode: null,
            });
        }
        const nationalPhoneNumber = typeof parsedPhoneNumber === "string"
            ? parsedPhoneNumber
            : parsedPhoneNumber.getNationalNumber();
        const countryCode = typeof parsedPhoneNumber === "string"
            ? null
            : parsedPhoneNumber.getCountryCode();
        const foundUser = await user_service_1.default.checkDoesUserExistWithPhoneNumber(phoneNumber);
        return res.status(200).send({
            returnValue: foundUser,
        });
    }
}
exports.default = new DevRouter().router;
//# sourceMappingURL=test.routes.js.map