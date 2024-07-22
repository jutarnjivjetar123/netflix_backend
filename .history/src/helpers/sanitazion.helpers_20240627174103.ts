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

  public static truncateAfterDomain(input: string): string {
    // Regular expression to match common domain extensions
    const domainPattern =
      /\.(com|org|net|edu|gov|mil|co|io|me|us|info|biz)(\/.*)?$/i;

    input = input.split(domainPattern)[0];
    console.log("------------> Replaced input: " + input);
    return input.replace(domainPattern, ".$1");
  }

  public static removeAllWhitespaces(input: string): string {
    // Remove leading and trailing whitespaces using trim()
    const trimmedInput = input.trim();
    // Remove all internal whitespaces
    const noInternalWhitespaces = trimmedInput.replace(/\s+/g, "");
    return noInternalWhitespaces;
  }

  public static sanitazeNonEmailData(inputData: string): string {
    inputData = this.removeControlCharacters(inputData);
    inputData = this.escapeHtml(inputData);
    inputData = this.trimWhitespace(inputData);
    inputData = inputData.replace(" ", "");
    return inputData;
  }

  public static sanitazeEmailData(emailData: string): string {
    emailData = this.truncateAfterDomain(emailData);
    return emailData;
  }

  public static extractEmail(input: string): string | null {
    // Regular expression to match an email address
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/;
    
    // Use the regex to find a match in the input string
    const match = input.match(emailRegex);
    
    // If a match is found, return the first match (the email address)
    // Otherwise, return null
    return match ? match[0] : null;
  }
  
  
}

console.log("TEST EMAIL: " + "test.user+malicious@example.com <img src=x onerror=alert('XSS')>" + " sanitazion:" + DataSanitazion.sanitazeEmailData("test.user+malicious@example.com <img src=x onerror=alert('XSS')>"));


