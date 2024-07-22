import * as validator from "validator";

export default class DataSanitazion {
  public static normalizeEmail(inputEmail: string): string {
    const email = validator.normalizeEmail(inputEmail);
    if (typeof email === "boolean" && !email) return inputEmail;
    return email;
  }

  public static trimWhitespace(inputData: string): string {
    return validator.trim(inputData);
  }

  public static removeControlCharacters(inputData: string): string {
    return validator.stripLow(inputData);
  }

  public static replaceHTMLWithEscapedCharacters(inputData: string): string {
    return validator.unescape(inputData);
  }
  public static replaceEscapedCharactersWithHTML(inputData: string): string {
    return validator.escape(inputData);
  }

  public static sanitazeNonEmailData(inputData: string): string {
    inputData = this.removeControlCharacters(inputData);
    inputData = this.replaceHTMLWithEscapedCharacters(inputData);
    inputData = this.trimWhitespace(inputData);
    inputData = inputData.replace(" ", "");
    return inputData;
  }

  public static sanit
}
