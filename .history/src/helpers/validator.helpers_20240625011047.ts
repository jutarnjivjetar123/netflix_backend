import * as validator from "validator";

export default class DataValidator {
  public escapeCharacters(inputData: string): string {
    return validator.escape(inputData);
  }

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
}
