"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../models/user.model/user.model"));
const email_model_1 = __importDefault(require("../../models/user.model/email.model"));
const phone_model_1 = __importDefault(require("../../models/user.model/phone.model"));
const password_model_1 = __importDefault(require("../../models/user.model/password.model"));
const salt_model_1 = __importDefault(require("../../models/user.model/salt.model"));
const config_database_1 = require("../../database/config.database");
const encryption_helper_1 = __importDefault(require("../../helpers/encryption.helper"));
const returnObject_utility_1 = __importDefault(require("../../utilities/returnObject.utility"));
const typeorm_1 = require("typeorm");
class UserRepository {
    static async createNewUser_DefaultForEmailCreation(firstName = null, lastName = null, username = null, usedEmailToSignUp = true) {
        const newUser = new user_model_1.default();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.username = username;
        newUser.usedEmailToSignUp = usedEmailToSignUp;
        newUser.createdAt = new Date();
        const userCreationResult = await config_database_1.DatabaseConnection.getRepository(user_model_1.default).save(newUser);
        if (!userCreationResult) {
            return new returnObject_utility_1.default("Could not create a new user with the provided data", null);
        }
        return new returnObject_utility_1.default("User create successfully with following data: " +
            JSON.stringify({
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                usedEmailToSignUp: newUser.usedEmailToSignUp,
            }), newUser);
    }
    static async createNewUserEmail(email, userToCreateEmailFor) {
        const newEmail = new email_model_1.default();
        newEmail.user = userToCreateEmailFor;
        newEmail.email = email;
        newEmail.createdAt = new Date();
        const emailCreationResult = await config_database_1.DatabaseConnection.getRepository(email_model_1.default).save(newEmail);
        if (!emailCreationResult) {
            return null;
        }
        return newEmail;
    }
    static async createNewUserPhoneNumber(phoneNumber, userToCreatePhoneNumberFor, countryCode = null, region = null) {
        const newPhoneNumber = new phone_model_1.default();
        newPhoneNumber.phoneNumber = phoneNumber;
        newPhoneNumber.user = userToCreatePhoneNumberFor;
        newPhoneNumber.internationalCallingCode = countryCode;
        newPhoneNumber.createdAt = new Date();
        return await config_database_1.DatabaseConnection.getRepository(phone_model_1.default)
            .save(newPhoneNumber)
            .then(() => {
            return new returnObject_utility_1.default("Created new phone number: " +
                newPhoneNumber.phoneNumber +
                " for user: " +
                newPhoneNumber.user, newPhoneNumber);
        })
            .catch((error) => {
            return new returnObject_utility_1.default("Failed to create new phone number " +
                phoneNumber +
                "error reason: " +
                error, null);
        });
    }
    static async createUserPassword(passwordHash, userToCreatePasswordFor) {
        const newPassword = new password_model_1.default();
        newPassword.salt = await encryption_helper_1.default.generateSalt();
        newPassword.hash = passwordHash;
        newPassword.createdAt = new Date();
        newPassword.user = userToCreatePasswordFor;
        const passwordCreationResult = await config_database_1.DatabaseConnection.getRepository(password_model_1.default).save(newPassword);
        if (!passwordCreationResult) {
            return null;
        }
        return newPassword;
    }
    static async createNewUserSalt(createSaltForUser) {
        const newSalt = new salt_model_1.default();
        newSalt.salt = await encryption_helper_1.default.generateSalt();
        newSalt.createdAt = new Date();
        newSalt.saltOwner = createSaltForUser;
        const newSaltCreationResult = await config_database_1.DatabaseConnection.getRepository(salt_model_1.default).save(newSalt);
        if (!newSaltCreationResult) {
            return null;
        }
        return newSalt;
    }
    static async getUserByEmail(email) {
        const userByEmail = await config_database_1.DatabaseConnection.getRepository(email_model_1.default).findOne({
            where: {
                email: email,
            },
            relations: {
                user: true,
            },
        });
        return userByEmail;
    }
    static async getUserByPhoneNumber(phoneNumber, countryCode = null) {
        const searchResult = await config_database_1.DatabaseConnection.getRepository(phone_model_1.default).findOne({
            where: {
                phoneNumber: (0, typeorm_1.ILike)(phoneNumber),
                internationalCallingCode: countryCode,
            },
            relations: {
                user: true,
            },
        });
        return searchResult ? searchResult.user : null;
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map