import * as validator from "validator";

export default class DataSanitazion {
  static public normalizeEmail(inputEmail: string): string {
    if (typeof email === "boolean" && !email) return inputEmail;
    const email = validator.normalizeEmail(inputEmail);
    return email;
  }

  public trimWhitespace(inputData: string): string {
    return validator.trim(inputData);
  }

  public removeControlCharacters(inputData: string): string {
    return validator.stripLow(inputData);
  }

  public replaceHTMLWithEscapedCharacters(inputData: string): string {
    return validator.unescape(inputData);
  }
  public replaceEscapedCharactersWithHTML(inputData: string): string {
    return validator.escape(inputData);
  }
}
