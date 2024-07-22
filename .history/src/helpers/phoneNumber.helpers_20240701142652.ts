import * as libphonenumber from "google-libphonenumber";


interface PhoneNumberObject {
  countryCode?: string;
  phoneNumber: string;
  region?: string;
}

export default class PhoneNumberHelper{ 


public static phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

public static  parsePhoneNumber(
  phoneNumberString: string,
  region: string = null
): PhoneNumberObject {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumberString, null);
    return {
      countryCode: parsedPhoneNumber.getCountryCode().toString(),
      phoneNumber: parsedPhoneNumber.getNationalNumber().toString(),
    };
  } catch (error) {
    return {
      countryCode: null,
      phoneNumber: phoneNumberString.split(/[^\+0-9]/).join(""),
      region: null,
    };
  }
}

public static validatePhoneNumberFromStringNOTSAFE(phoneNumberString: string) {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumberString, null);
    return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  } catch (error) {
    phoneNumberString = phoneNumberString.split(/[^\+0-9]/).join("");
    return validator.isMobilePhone(phoneNumberString);
  }
}

public static isValidPhoneNumberFromPhoneNumberType(phoneNumber: PhoneNumberObject) {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber.phoneNumber);
    return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  } catch (error) {
    return false;
  }
}
