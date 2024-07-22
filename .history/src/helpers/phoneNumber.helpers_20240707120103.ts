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
  //Return phone number and country code, or returns phone number only, if parsing is not possible 
  public static parsePhoneNumberFromString(phoneNumber: string) { 
    
  }
}
