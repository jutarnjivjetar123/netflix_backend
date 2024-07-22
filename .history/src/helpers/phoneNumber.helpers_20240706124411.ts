import * as libphonenumber from "google-libphonenumber";
import validator from "validator";
export interface PhoneNumberObject {
  countryCode?: string;
  phoneNumber: string;
  region?: string;
}

export class PhoneNumberHelper {
  public static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

  public static parsePhoneNumber(
    phoneNumberString: string,
    region: string = null
  ): PhoneNumberObject {
    try {
      const parsedPhoneNumber = this.phoneNumberUtil.parse(
        phoneNumberString,
        null
      );
      return {
        countryCode: parsedPhoneNumber.getCountryCode().toString(),
        phoneNumber: parsedPhoneNumber.getNationalNumber().toString(),
        region: 
      };
    } catch (error) {
      return {
        countryCode: null,
        phoneNumber: phoneNumberString.split(/[^\+0-9]/).join(""),
        region: null,
      };
    }
  }

  public static isValidPhoneNumberFromString(phoneNumberString: string) {
    try {
      const parsedPhoneNumber = this.phoneNumberUtil.parse(
        phoneNumberString,
        null
      );
      return this.phoneNumberUtil.isValidNumber(parsedPhoneNumber);
    } catch (error) {
      phoneNumberString = phoneNumberString.split(/[^\+0-9]/).join("");
      return validator.isMobilePhone(phoneNumberString);
    }
  }

  public static isValidPhoneNumberFromPhoneNumberType(
    phoneNumber: PhoneNumberObject
  ) {
    try {
      const parsedPhoneNumber = this.phoneNumberUtil.parse(
        phoneNumber.phoneNumber
      );
      return this.phoneNumberUtil.isValidNumber(parsedPhoneNumber);
    } catch (error) {
      return false;
    }
  }
}