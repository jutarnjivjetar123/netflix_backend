import * as libphonenumber from "google-libphonenumber";
export default class PhoneNumberHelper {
  public static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

  public static parsePhoneNumber(phoneNumber: string) {
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+" + phoneNumber;
    }
    const parsedPhoneNumber = this.phoneNumberUtil.parse(phoneNumber);
    return parsedPhoneNumber;
  }

  public static validatePhoneNumberFromString(phoneNumber: string) {
    const parsedPhoneNumber = this.parsePhoneNumber(phoneNumber);
    return this.phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  }

  public static validatePhoneNumberFromPhoneNumberType(
    phoneNumber: libphonenumber.PhoneNumber
  ) {
    return this.phoneNumberUtil.isValidNumber(phoneNumber);
  }

  public static getCountryCode(phoneNumber: libphonenumber.PhoneNumber) { 
    libphonenumber.PhoneNumber
  }

  public static convertPhoneNumberTypeToString(
    phoneNumber: libphonenumber.PhoneNumber
  ) {
    return this.phoneNumberUtil.format(
      phoneNumber,
      libphonenumber.PhoneNumberFormat.E164
    );
  }
}
