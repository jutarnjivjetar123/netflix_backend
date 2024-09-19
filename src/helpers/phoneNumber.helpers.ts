import * as libphonenumber from "google-libphonenumber";
import validator from "validator";
import ReturnObjectHandler from "../utilities/returnObject.utility";

//Parse phone numbers using google-libphonenumber library
/*                  METHODS
- Parse phone number from string to google-libphonenumber interface PhoneNumber, string must include national calling code and phone number
- Parse and validate string, if the validation is successful return true, else return false
- Parse and validate string, if the validation is successful return parsed phone number, else return null

*/
export interface PhoneNumberObject {
  countryCode?: string;
  phoneNumber: string;
  region?: string;
}

export class PhoneNumberHelper {
  public static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();
  public static parsePhoneNumberFromStringToPhoneNumberObjectInterfaceFromGooglelibphonenumber(
    phoneNumberString: string
  ) {
    console.log(
      "Parsed value: \nPhone number:" +
        this.phoneNumberUtil.parse(phoneNumberString).getNationalNumber() +
        "\nCountry code: " +
        this.phoneNumberUtil.parse(phoneNumberString).getCountryCode()
    );
  }

  public static isValidPhoneNumber(phoneNumberString: string) {
    let phoneNumber;
    try {
      phoneNumber = this.phoneNumberUtil.parse(phoneNumberString);
      console.log(
        "Parsed value: " +
          phoneNumber.getCountryCode() +
          " " +
          phoneNumber.getNationalNumber()
      );
    } catch (error) {
      console.log(error.message);
      return false;
    }

    let isValid;
    try {
      isValid = this.phoneNumberUtil.isValidNumber(phoneNumber);
      return isValid;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  public static parseAndValidatePhoneNumberFromString(
    phoneNumberString: string
  ): libphonenumber.PhoneNumber {
    let phoneNumber;
    try {
      phoneNumber = this.phoneNumberUtil.parse(phoneNumberString);
      console.log(
        "Parsed value: " +
          phoneNumber.getCountryCode() +
          " " +
          phoneNumber.getNationalNumber()
      );
    } catch (error) {
      console.log(error.message);
      return null;
    }

    try {
      if (!this.phoneNumberUtil.isValidNumber(phoneNumber)) {
        return null;
      }
    } catch (error) {
      console.log(error.message);
      return null;
    }
    return phoneNumber;
  }
}
