import * as validator from "validator";

export default class DataValidator {
  public escapeCharacters(inputData: string): string {
    return validator.escape(inputData);
  }

  public normalizeEmail(inputEmail: string): string {
      const email = validator.normalizeEmail(inputEmail);
      if (!email)
          return inputData;
      
  }
}
