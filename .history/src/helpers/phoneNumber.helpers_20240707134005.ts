import * as libphonenumber from "google-libphonenumber";
import validator from "validator";

export interface PhoneNumberObject {
  countryCode?: string;
  phoneNumber: string;
  region?: string;
}

export class PhoneNumberHelper {
  public static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

  //Method for phone number parsing, converts number from string to PhoneNumber object defined in libphonenumber
  //Return phone number and country code, or returns phone number only, if parsing is not possible causes error
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
      return error.message;
    }
  }
}
