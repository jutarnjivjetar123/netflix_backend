import * as validator from "validator";

export default class DataValidator {
  public escapeCharacters(inputData: string): string {
    return validator.escape(inputData);
  }

  public normalizeEmail(inputEmail: string): string {
    return validator.normalizeEmail(inputEmail);
  }
}
