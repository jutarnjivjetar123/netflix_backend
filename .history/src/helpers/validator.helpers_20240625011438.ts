import * as validator from "validator";

export default class DataSanita {
  public normalizeEmail(inputEmail: string): string {
    const email = validator.normalizeEmail(inputEmail);
    if (typeof email === "boolean" && !email) return inputEmail;
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
