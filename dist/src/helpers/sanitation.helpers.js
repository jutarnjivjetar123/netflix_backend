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
Object.defineProperty(exports, "__esModule", { value: true });
const validator = __importStar(require("validator"));
class DataSanitation {
    static removeAllWhitespaces(inputData) {
        return inputData.split(/\s+/).join("");
    }
    static removeAllSpecialCharacters(inputData, charactersToRemove = /[^a-zA-Z0-9._]/g) {
        return inputData.replace(charactersToRemove, "");
    }
    static escapeHtml(input) {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;",
        };
        return input.replace(/[&<>"'`=/]/g, function (char) {
            return map[char];
        });
    }
    static replaceHTMLTagsWithEmptyString(input) {
        return input.replace(/<[^>]*>/g, ""); // This regex matches HTML tags and replaces them with an empty string.
    }
    static removeAllButNumbersFromString(inputString) {
        return inputString.split(/^\+1|[^0-9]+/).join("");
    }
    static normalizeEmail(emailToNormalize) {
        const validatedValue = validator.normalizeEmail(emailToNormalize);
        if (typeof validatedValue === "boolean") {
            return null;
        }
        return validatedValue;
    }
    static extractEmailFromText(input) {
        const emailRegex = /([a-zA-Z0-9]|\.|\+|\-)+\@{1}([a-zA-Z]|\.)+\.[a-z]{2,3}/;
        const match = input.match(emailRegex);
        return match ? match[0] : null;
    }
    static sanitizeEmail(inputEmail) {
        inputEmail = DataSanitation.removeAllWhitespaces(inputEmail);
        inputEmail = DataSanitation.replaceHTMLTagsWithEmptyString(inputEmail);
        inputEmail = DataSanitation.extractEmailFromText(inputEmail);
        inputEmail = DataSanitation.normalizeEmail(inputEmail);
        return inputEmail;
    }
    static sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhiteSpacesRemovalAndLowercasing(inputData) {
        inputData = this.replaceHTMLTagsWithEmptyString(inputData);
        inputData = this.removeAllSpecialCharacters(inputData);
        inputData = inputData.toLowerCase();
        return inputData;
    }
    static sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhitespacesRemoval(inputString) {
        inputString = this.replaceHTMLTagsWithEmptyString(inputString);
        inputString = this.removeAllSpecialCharacters(inputString);
        inputString = this.removeAllWhitespaces(inputString);
        return inputString;
    }
    static sanitizePhoneNumber(phoneNumberToSanitize) {
        phoneNumberToSanitize = this.removeAllWhitespaces(phoneNumberToSanitize);
        phoneNumberToSanitize = this.removeAllButNumbersFromString(phoneNumberToSanitize);
        return phoneNumberToSanitize;
    }
}
exports.default = DataSanitation;
//# sourceMappingURL=sanitation.helpers.js.map