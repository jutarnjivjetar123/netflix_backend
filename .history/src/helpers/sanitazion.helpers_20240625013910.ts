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
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return input.replace(/[&<>"'`=/]/g, function(char) {
        return map[char];
    });
}

  public static sanitazeNonEmailData(inputData: string): string {
    inputData = this.removeControlCharacters(inputData);
    inputData = this.replaceHTMLWithEscapedCharacters(inputData);
    inputData = this.trimWhitespace(inputData);
    inputData = inputData.replace(" ", "");
    return inputData;
  }

  public static sanitazeEmailData(emailData: string): string {
    emailData = this.normalizeEmail(emailData);
    emailData = this.removeControlCharacters(emailData);
    emailData = this.replaceHTMLWithEscapedCharacters(emailData);
    emailData = emailData.replace(" ", "");
    emailData = this.trimWhitespace(emailData);
    return emailData;
  }
}