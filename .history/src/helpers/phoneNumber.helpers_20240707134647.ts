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
      return parsedPhoneNumber;
    } catch (error) {
      console.log(error);
      if (error.message === "Invalid country calling code") {
        return phoneNumber.split(/[^0-9]/).join("");
      }
      throw new Error(error.message);
    }
  }
}
