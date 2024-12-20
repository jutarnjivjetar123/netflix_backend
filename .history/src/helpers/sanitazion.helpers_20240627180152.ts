import * as validator from "validator";


class DataSanitation {
  public static removeAllWhitespaces(inputData: string) {
    return inputData.split(/\s+/).join("");
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

  public static normalizeEmail(emailToNormalize: string): string | null {
    const validatedValue = validator.normalizeEmail(emailToNormalize);

    if (typeof validatedValue === "boolean") {
      return null;
    }
    return validatedValue;
  }

  public static extractEmailFromText(input: string): string | null {
    // Regular expression to match an email address
    const emailRegex =
      /([a-z0-9]|[a-z0-9\.]|[a-z0-9̣_])+\@[a-z]+[\.]+[a-z]{2,3}/;

    // Use the regex to find a match in the input string
    const match = input.match(emailRegex);

    // If a match is found, return the first match (the email address)
    // Otherwise, return null
    return match ? match[0] : null;
  }
  public static sanitizeEmail(inputEmail: string): string {
    inputEmail = DataSanitation.removeAllWhitespaces(inputEmail);
    inputEmail = DataSanitation.replaceHTMLTagsWithEmptyString(inputEmail);
    inputEmail = DataSanitation.extractEmailFromText(inputEmail);
    inputEmail = DataSanitation.normalizeEmail(inputEmail);
    return inputEmail;
  }

  public static sanitizeNONEmailDataWithHTMLRemovalAndLowercasing(
    inputData: string
  ): string {
    inputData = this.removeAllSpecialCharacters(inputData);
    inputData = inputData.toLowerCase();
    return inputData;
  }
}
