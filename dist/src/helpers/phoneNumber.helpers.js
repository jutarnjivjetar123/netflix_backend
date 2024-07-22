"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumberHelper = void 0;
const libphonenumber = __importStar(require("google-libphonenumber"));
const validator_1 = __importDefault(require("validator"));
class PhoneNumberHelper {
    static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();
    //Method for phone number parsing, converts phone number in string form to PhoneNumber object defined in libphonenumber
    //libphonenumber.phoneNumberUtil.parse takes in string phone number, and if there is no country code specified throws an exception
    //and if the exception for invalid country code is thrown then it returns a phone number string with only numbers (0-9)
    //remaining, all other character are removed, if the thrown expception type is not "Invalid country code", then it return an error message
    static parsePhoneNumberFromString(phoneNumber) {
        //Parse phone number with country code
        try {
            const parsedPhoneNumber = this.phoneNumberUtil.parse(phoneNumber);
            console.info(new Date() +
                " -> LOG::Info::PhoneNumberHelper::parsePhoneNumberFromString::parsedPhoneNumber::Parsed phone number from string: " +
                phoneNumber +
                " to PhoneNumber object with national number value: " +
                parsedPhoneNumber.getNationalNumber());
            return parsedPhoneNumber;
        }
        catch (error) {
            if (error.message === "Invalid country calling code") {
                console.info(new Date() +
                    " -> LOG::Info::PhoneNumberHelper::parsePhoneNumberFromString::parsedPhoneNumber::Parsed phone number from string: " +
                    phoneNumber +
                    " but no country code was provided, returning original phone number with only [0-9] characters: " +
                    phoneNumber);
                return phoneNumber.split(/[^0-9]/).join("");
            }
            console.error(new Date() +
                " -> LOG::ERROR::PhoneNumberHelper::parsePhoneNumberFromString::parsedPhoneNumber::Parsing phone number value: " +
                phoneNumber +
                " cause following error: " +
                error.message);
            throw new Error(error.message);
        }
    }
    static isValidPhoneNumberFromString(phoneNumberString) {
        try {
            const parsedPhoneNumber = this.parsePhoneNumberFromString(phoneNumberString);
            if (typeof parsedPhoneNumber !== "string") {
                return this.phoneNumberUtil.isValidNumber(parsedPhoneNumber);
            }
            return validator_1.default.isMobilePhone(parsedPhoneNumber);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.PhoneNumberHelper = PhoneNumberHelper;
//# sourceMappingURL=phoneNumber.helpers.js.map