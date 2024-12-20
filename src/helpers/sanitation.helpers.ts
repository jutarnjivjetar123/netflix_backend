import * as validator from "validator";

export default class DataSanitation {
  public static removeAllWhitespaces(inputData: string) {
    return inputData.split(/\s+/).join("");
  }
  public static isEmail(checkValue: string) {
    return validator.isEmail(checkValue);
  }
  public static removeAllSpecialCharacters(
    inputData: string,
    charactersToRemove: RegExp = /[^a-zA-Z0-9._]/g
  ) {
    return inputData.replace(charactersToRemove, "");
  }

  public static escapeHtml(input: string): string {
    const map: { [key: string]: string } = {
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

  public static replaceHTMLTagsWithEmptyString(input: string): string {
    return input.replace(/<[^>]*>/g, ""); // This regex matches HTML tags and replaces them with an empty string.
  }

  public static removeAllButNumbersFromString(inputString: string): string {
    return inputString.split(/^\+1|[^0-9]+/).join("");
  }

  public static normalizeEmail(emailToNormalize: string): string | null {
    const validatedValue = validator.normalizeEmail(emailToNormalize);

    if (typeof validatedValue === "boolean") {
      return null;
    }
    return validatedValue;
  }

  public static extractEmailFromText(input: string): string | null {
    const emailRegex = /([a-zA-Z0-9]|\.|\+|\-)+\@{1}([a-zA-Z]|\.)+\.[a-z]{2,3}/;

    const match = input.match(emailRegex);

    return match ? match[0] : null;
  }
  public static sanitizeEmail(inputEmail: string): string {
    inputEmail = DataSanitation.removeAllWhitespaces(inputEmail);
    inputEmail = DataSanitation.replaceHTMLTagsWithEmptyString(inputEmail);
    inputEmail = DataSanitation.extractEmailFromText(inputEmail);
    inputEmail = DataSanitation.normalizeEmail(inputEmail);
    return inputEmail;
  }

  public static sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhiteSpacesRemovalAndLowercasing(
    inputData: string
  ): string {
    inputData = this.replaceHTMLTagsWithEmptyString(inputData);
    inputData = this.removeAllSpecialCharacters(inputData);
    inputData = inputData.toLowerCase();
    return inputData;
  }

  public static sanitizeNONEmailDataWithHTMLAndSpecialCharactersAndWhitespacesRemoval(
    inputString: string
  ): string {
    inputString = this.replaceHTMLTagsWithEmptyString(inputString);
    inputString = this.removeAllSpecialCharacters(inputString);
    inputString = this.removeAllWhitespaces(inputString);
    return inputString;
  }

  public static sanitizePhoneNumber(phoneNumberToSanitize: string): string {
    phoneNumberToSanitize = this.removeAllWhitespaces(phoneNumberToSanitize);
    phoneNumberToSanitize = this.removeAllButNumbersFromString(
      phoneNumberToSanitize
    );
    return phoneNumberToSanitize;
  }
}
