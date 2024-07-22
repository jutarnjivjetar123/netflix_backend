"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanitation_helpers_1 = __importDefault(require("../../helpers/sanitation.helpers"));
const user_repository_1 = __importDefault(require("../../repository/user.repository/user.repository"));
const returnObject_utility_1 = __importDefault(require("../../utilities/returnObject.utility"));
const encryption_helper_1 = __importDefault(require("../../helpers/encryption.helper"));
const validator_1 = __importDefault(require("validator"));
const phoneNumber_helpers_1 = require("../../helpers/phoneNumber.helpers");
class UserService {
    static async checkDoesUserExistWithEmail(email) {
        if (!validator_1.default.isEmail(email)) {
            return new returnObject_utility_1.default("Provided email cannot be considered valid email address", false);
        }
        email = sanitation_helpers_1.default.sanitizeEmail(email);
        const databaseSearchResult = await user_repository_1.default.getUserByEmail(email);
        if (databaseSearchResult) {
            return new returnObject_utility_1.default("Email " + email + " taken", true);
        }
        return new returnObject_utility_1.default("Email not used", false);
    }
    static async checkDoesUserExistWithPhoneNumber(phoneNumber) {
        console.log(new Date() +
            " -> LOG::Info::UserService::checkDoesUserExistWithPhoneNumber::parameter phoneNumber has value of: " +
            phoneNumber);
        let parsedPhoneNumber;
        try {
            parsedPhoneNumber =
                phoneNumber_helpers_1.PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
        }
        catch (error) {
            console.log(new Date() +
                " -> LOG::Error::UserService::checkDoesUserExistWithPhoneNumber::parsedPhoneNumber::TryCatch statement::Error exception: " +
                error.message +
                "::Could not parse phone number: " +
                phoneNumber);
            return new returnObject_utility_1.default(error.message, null);
        }
        const nationalPhoneNumber = typeof parsedPhoneNumber === "string"
            ? parsedPhoneNumber
            : parsedPhoneNumber.getNationalNumber();
        const countryCode = typeof parsedPhoneNumber === "string"
            ? null
            : parsedPhoneNumber.getCountryCode();
        const foundUser = await user_repository_1.default.getUserByPhoneNumber(nationalPhoneNumber, countryCode);
        console.log(new Date() +
            " -> LOG::Info::UserService::checkDoesUserExistWithPhoneNumber::foundUser::Result of database search for user with phone number returned: " +
            foundUser);
        if (!foundUser) {
            return new returnObject_utility_1.default("User with phone number with value: " + phoneNumber + " does not exist", false);
        }
        return new returnObject_utility_1.default("User with phone number " + phoneNumber + " exists", true);
    }
    static async createNewUserObjectByEmail(firstName, lastName, username) {
        const userCreationResult = await user_repository_1.default.createNewUser_DefaultForEmailCreation(firstName, lastName, username);
        if (!userCreationResult) {
            return new returnObject_utility_1.default("Could not create new user", null);
        }
        return new returnObject_utility_1.default("User created successfully with the following data: " +
            JSON.stringify({
                username: userCreationResult.returnValue.username,
                firstName: userCreationResult.returnValue.firstName,
                lastName: userCreationResult.returnValue.lastName,
                usedEmailToSignUp: userCreationResult.returnValue.userEmailToSignUp,
            }), userCreationResult.returnValue);
    }
    static async createNewUserWithPhoneNumber(firstName = null, lastName = null, username = null) {
        const userCreationResult = await user_repository_1.default.createNewUser_DefaultForEmailCreation(firstName, lastName, username, false);
        if (!userCreationResult) {
            return new returnObject_utility_1.default("Could not create new user", null);
        }
        return new returnObject_utility_1.default("Created new user with ID: " + userCreationResult.returnValue.userID, userCreationResult.returnValue);
    }
    static async createNewUserEmailObject(email, userSigningUp) {
        const newEmail = await user_repository_1.default.createNewUserEmail(email, userSigningUp);
        if (!newEmail) {
            return new returnObject_utility_1.default("Could not create new email with value: " +
                email +
                " for user wiht id: " +
                userSigningUp.userID, null);
        }
        return new returnObject_utility_1.default("Created new email " +
            newEmail.email +
            " for user with ID: " +
            userSigningUp.userID, newEmail);
    }
    static async createNewPhoneNumber(phoneNumber, userToCreatePhoneNumberFor, countryCode = null) {
        const createdPhoneNumber = await user_repository_1.default.createNewUserPhoneNumber(phoneNumber, userToCreatePhoneNumberFor, countryCode);
        return createdPhoneNumber;
    }
    static async createNewPassword(password, userToCreatePasswordFor) {
        const passwordHash = await encryption_helper_1.default.hashPassword(password);
        const newPassword = await user_repository_1.default.createUserPassword(passwordHash, userToCreatePasswordFor);
        if (!newPassword) {
            return new returnObject_utility_1.default("Could not create new password for user with ID: " +
                userToCreatePasswordFor.userID, null);
        }
        return new returnObject_utility_1.default("Created new password for user with ID: " +
            userToCreatePasswordFor.userID, newPassword);
    }
    static async createNewSalt(createSaltForUser) {
        const newUserSalt = await user_repository_1.default.createNewUserSalt(createSaltForUser);
        if (!newUserSalt) {
            return new returnObject_utility_1.default("Could not create new salt for user with ID: " +
                createSaltForUser.userID, null);
        }
        return new returnObject_utility_1.default("Created new salt for user with ID: " + createSaltForUser.userID, newUserSalt);
    }
    static async createUserObjectByPhoneNumber(firstName = null, lastName = null, username = null) {
        const userCreationResult = await user_repository_1.default.createNewUser_DefaultForEmailCreation(firstName, lastName, username, false);
        if (!userCreationResult.returnValue) {
            return new returnObject_utility_1.default("Could not create new user", null);
        }
        return new returnObject_utility_1.default("User created successfully with the following data: " +
            JSON.stringify({
                username: userCreationResult.returnValue.username,
                firstName: userCreationResult.returnValue.firstName,
                lastName: userCreationResult.returnValue.lastName,
                usedEmailToSignUp: userCreationResult.returnValue.userEmailToSignUp,
            }), userCreationResult.returnValue);
    }
    static async createNewUserByEmail(firstName = null, lastName = null, username = null, email, password) {
        if (!email) {
            return new returnObject_utility_1.default("Email must be provided", null);
        }
        if (!password) {
            return new returnObject_utility_1.default("Password must be provided", null);
        }
        if (!validator_1.default.isEmail(email)) {
            return new returnObject_utility_1.default("Provided email cannot be considered valid email address", null);
        }
        if (firstName) {
            firstName = sanitation_helpers_1.default.replaceHTMLTagsWithEmptyString(firstName);
            firstName = sanitation_helpers_1.default.removeAllSpecialCharacters(firstName);
            firstName = sanitation_helpers_1.default.removeAllWhitespaces(firstName);
        }
        if (lastName) {
            lastName = sanitation_helpers_1.default.replaceHTMLTagsWithEmptyString(lastName);
            lastName = sanitation_helpers_1.default.removeAllSpecialCharacters(lastName);
            lastName = sanitation_helpers_1.default.removeAllWhitespaces(lastName);
        }
        if (username) {
            username = sanitation_helpers_1.default.replaceHTMLTagsWithEmptyString(username);
            username = sanitation_helpers_1.default.removeAllSpecialCharacters(username);
            username = sanitation_helpers_1.default.removeAllWhitespaces(firstName);
        }
        const userCreationResult = await this.createNewUserObjectByEmail(username, firstName, lastName);
        if (!userCreationResult.returnValue) {
            return new returnObject_utility_1.default("Could not create new user", null);
        }
        const parsedEmail = sanitation_helpers_1.default.sanitizeEmail(email);
        const createdEmail = await this.createNewUserEmailObject(parsedEmail, userCreationResult.returnValue);
        if (!createdEmail.returnValue) {
            return new returnObject_utility_1.default("Could not create email for user with ID: " +
                userCreationResult.returnValue.userID, null);
        }
        password = sanitation_helpers_1.default.removeAllWhitespaces(password);
        const createdPassword = await this.createNewPassword(password, userCreationResult.returnValue);
        if (!createdPassword.returnValue) {
            return new returnObject_utility_1.default("Could not create new password for user", null);
        }
        const createdSalt = await this.createNewSalt(userCreationResult.returnValue);
        if (!createdSalt.returnValue) {
            return createdSalt;
        }
        return new returnObject_utility_1.default("User created successfully with the following data: " +
            JSON.stringify({
                userID: userCreationResult.returnValue.userID,
                email: createdEmail.returnValue.email,
                passwordID: createdPassword.returnValue.passwordID,
                saltID: createdSalt.returnValue.saltID,
            }), {
            userObject: userCreationResult.returnValue,
            emailObject: createdEmail.returnValue,
            passwordObject: createdPassword.returnValue,
            saltObject: createdSalt.returnValue,
        });
    }
    static async registerUserWithPhoneNumber(firstName = null, lastName = null, username = null, phoneNumber, password) {
        console.log(new Date() +
            " -> LOG::Info::UserService::registerUserWithPhoneNumber::paramater values and types (output format variable: type = value):" +
            "\nfirstName: " +
            typeof firstName +
            " = " +
            firstName +
            "\nlastName: " +
            typeof lastName +
            " = " +
            lastName +
            "\nusername: " +
            typeof username +
            " = " +
            username +
            "\nphoneNumber: " +
            typeof phoneNumber +
            " = " +
            phoneNumber +
            "\npassword: " +
            typeof password +
            " = " +
            password);
        //Control input - check are required values provided
        if (!phoneNumber) {
            return new returnObject_utility_1.default("Phone number must be provided", null);
        }
        if (!password) {
            return new returnObject_utility_1.default("Password must be provided", null);
        }
        //Validate input of optional values
        if (firstName) {
            firstName = sanitation_helpers_1.default.replaceHTMLTagsWithEmptyString(firstName);
            firstName = sanitation_helpers_1.default.removeAllSpecialCharacters(firstName);
            firstName = sanitation_helpers_1.default.removeAllWhitespaces(firstName);
        }
        if (lastName) {
            lastName = sanitation_helpers_1.default.replaceHTMLTagsWithEmptyString(lastName);
            lastName = sanitation_helpers_1.default.removeAllSpecialCharacters(lastName);
            lastName = sanitation_helpers_1.default.removeAllWhitespaces(lastName);
        }
        if (username) {
            username = sanitation_helpers_1.default.replaceHTMLTagsWithEmptyString(username);
            username = sanitation_helpers_1.default.removeAllSpecialCharacters(username);
            username = sanitation_helpers_1.default.removeAllWhitespaces(firstName);
        }
        //Parse phone number input, get either only phone number (nationalPhoneNumber has value of parsedPhoneNumber, countryCode has value of null), or national phone number with country code (nationalPhoneNumber has value of parsedPhoneNumber object type of libphonenumber.PhoneNumber with used function getNationalNumber, and countryCode has value of parsedPhoneNumber object type of libphonenumber.PhoneNumber with used function getCountryCode)
        let parsedPhoneNumber;
        console.log(new Date() +
            " -> LOG::Info::UserService::registerUserWithPhoneNumber::parameter phoneNumber has value of before parsing: " +
            phoneNumber +
            " and parsedPhoneNumber has value of: " +
            parsedPhoneNumber);
        try {
            parsedPhoneNumber =
                phoneNumber_helpers_1.PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
        }
        catch (error) {
            return new returnObject_utility_1.default(error.message, null);
        }
        //Check is phone number already taken
        const isNumberTaken = await this.checkDoesUserExistWithPhoneNumber(parsedPhoneNumber);
        if (isNumberTaken.returnValue === true) {
            return new returnObject_utility_1.default("Phone number " + phoneNumber + " is taken", null);
        }
        if (isNumberTaken.returnValue === null) {
            return new returnObject_utility_1.default("Error occured creating phone number, error message: " +
                isNumberTaken.getMessage(), null);
        }
        //Either use only phone number or phone number with country code
        let nationalPhoneNumber;
        let countryCodeForPhoneNumber;
        if (typeof parsedPhoneNumber === "string") {
            nationalPhoneNumber = parsedPhoneNumber;
            countryCodeForPhoneNumber = null;
        }
        if (typeof parsedPhoneNumber !== "string") {
            nationalPhoneNumber = parsedPhoneNumber.getNationalNumber();
            countryCodeForPhoneNumber = parsedPhoneNumber.getCountryCode();
        }
        //Try to create new user in database with given data
        const newUserCreationResult = await this.createNewUserWithPhoneNumber(firstName, lastName, username);
        if (!newUserCreationResult.returnValue) {
            return newUserCreationResult;
        }
        //newUser constant which stores returnValue from returned object, which represents newly created user  in the database
        const newUser = newUserCreationResult.returnValue;
        //constant for phoneNumber object from the database for the given user
        const newPhoneNumber = await this.createNewPhoneNumber(nationalPhoneNumber, newUser, countryCodeForPhoneNumber);
        if (!newPhoneNumber.returnValue) {
            return newPhoneNumber;
        }
        //constant for user password object
        const newPassword = await this.createNewPassword(password, newUser);
        if (!newPassword.returnValue) {
            return new returnObject_utility_1.default("Could not create password", null);
        }
        const newSalt = await this.createNewSalt(newUser);
        if (!newSalt.returnValue) {
            return new returnObject_utility_1.default("Could not create new salt", null);
        }
        return new returnObject_utility_1.default("Successfully created new user using phone number, returning created data for objects User, UserPhoneNumber, UserPassword, UserSalt", {
            user: newUser,
            phoneNumber: newPhoneNumber.returnValue,
            password: newPassword.returnValue,
            salt: newSalt.returnValue,
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map