import * as libphonenumber from "google-libphonenumber";
import validator from "validator";

export interface PhoneNumberObject {
  countryCode?: string;
  phoneNumber: string;
  region?: string;
}

export class PhoneNumberHelper {
  public static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

  //Method for phone number parsing, converts phone number in string form to PhoneNumber object defined in libphonenumber
  //libphonenumber.phoneNumberUtil.parse takes in string phone number, and if there is no country code specified throws an exception
  //and if the exception for invalid country code is thrown then it returns a phone number string with only numbers (0-9)
  //remaining, all other character are removed, if the thrown expception type is not "Invalid country code", then it return an error message
  public static parsePhoneNumberFromString(
    phoneNumber: string
  ): libphonenumber.PhoneNumber | string {
    //Parse phone number with country code
    try {
      const parsedPhoneNumber = this.phoneNumberUtil.parse(phoneNumber);
      console.info(
        new Date() +
          " -> LOG::Info::PhoneNumberHelper::parsePhoneNumberFromString::parsedPhoneNumber::Parsed phone number from string: " +
          phoneNumber +
          " to PhoneNumber object with national number value: " +
          parsedPhoneNumber.getNationalNumber()
      );
      return parsedPhoneNumber;
    } catch (error) {
      if (error.message === "Invalid country calling code") {
        console.info(
          new Date() +
            " -> LOG::Info::PhoneNumberHelper::parsePhoneNumberFromString::parsedPhoneNumber::Parsed phone number from string: " +
            phoneNumber +
            " but no country code was provided, returning original phone number with only [0-9] characters: " +
            phoneNumber
        );
        return phoneNumber.split(/[^0-9]/).join("");
      }
      console.error(
        new Date() +
          " -> LOG::ERROR::PhoneNumberHelper::parsePhoneNumberFromString::parsedPhoneNumber::Parsing phone number value: " +
          phoneNumber +
          " cause following error: " +
          error.message
      );

      throw new Error(error.message);
    }
  }

  public static isValidPhoneNumberFromString(
    phoneNumberString: string
  ): boolean {
    try {
      const parsedPhoneNumber =
        this.parsePhoneNumberFromString(phoneNumberString);
      if (typeof parsedPhoneNumber !== "string") {
        return this.phoneNumberUtil.isValidNumber(parsedPhoneNumber);
      }
      return validator.isMobilePhone(parsedPhoneNumber);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public static isPhoneNumberNumericOnly(phoneNumber: string) {
    return phoneNumber.match(/(?!^\+)\+|[^\d+]/);
  }
  public static getNationalNumberAndCountryCodeFromPhoneNumber(phoneNumber: string) { 
    let parsedPhoneNumber;
    try {
      parsedPhoneNumber =
        PhoneNumberHelper.parsePhoneNumberFromString(phoneNumber);
    } catch (error) {
      return new ReturnObjectHandler(error.message, null);
    }
  }
}
