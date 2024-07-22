import * as libphonenumber from "google-libphonenumber";


interface PhoneNumberObject {
  countryCode?: string;
  phoneNumber: string;
  region?: string;
}

export default 
const phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

function parsePhoneNumber(
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

function validatePhoneNumberFromStringNOTSAFE(phoneNumberString: string) {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumberString, null);
    return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  } catch (error) {
    phoneNumberString = phoneNumberString.split(/[^\+0-9]/).join("");
    return validator.isMobilePhone(phoneNumberString);
  }
}

function isValidPhoneNumberFromPhoneNumberType(phoneNumber: PhoneNumberObject) {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber.phoneNumber);
    return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  } catch (error) {
    return false;
  }
}
