import { Request, Response } from "express";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import DataSanitation from "../../helpers/sanitation.helpers";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import EncryptionHelpers from "../../helpers/encryption.helper";
import UserRegisterRepository from "../../repository/user/register.user.repository";
export default class UserService {
  static async registerUser(email, countryCode, phoneNumber, password) {
    //Check is any required parameter missing
    if (!email && (!countryCode || !phoneNumber)) {
      return new ReturnObjectHandler(
        "Email or phone number with country code are required",
        null,
        400
      );
    }
    if (!password) {
      return new ReturnObjectHandler("Password is required", null, 400);
    }

    let publicIdReturnValue;
    if (!phoneNumber && !countryCode && email) {
      //Check is email valid format
      if (email && !DataSanitation.isEmail(email)) {
        return new ReturnObjectHandler(
          "Given email, cannot be considered a valid email address",
          null,
          400
        );
      }
      //Check does user already exist with given email
      if (await UserRegisterRepository.checkDoesUserExistWithEmail(email)) {
        return new ReturnObjectHandler("Email taken", null, 400);
      }
      //Create new User class instance, object with provided data
      const user = await UserRegisterRepository.createUserObject(true);
      if (!user) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }
      //Create new UserEmail object for newly created User object with provided email
      const emailObject = await UserRegisterRepository.createUserEmailObject(
        user,
        email
      );
      if (!emailObject) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }

      //Create new UserPassword object for newly created User object with provided password
      const passwordSalt = await EncryptionHelpers.generateSalt(12);
      const hashPassword = await EncryptionHelpers.hashPassword(password);
      const passwordObject =
        await UserRegisterRepository.createUserPasswordObject(
          user,
          hashPassword,
          passwordSalt
        );
      if (!passwordObject) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }

      //Create UserPublicId object for newly created User object
      const publicId = await UserRegisterRepository.createUserPublicId(user);
      if (!publicId) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }

      //Create UserSalt object for newly created User object
      const salt = await UserRegisterRepository.createUserSalt(user);
      console.log(salt);
      if (!salt) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }
      console.log(publicId);
      publicIdReturnValue = publicId.publicId;
    }
    if (phoneNumber && countryCode && !email) {
      //Check is phone number valid
      if (
        phoneNumber &&
        countryCode &&
        !PhoneNumberHelper.isValidPhoneNumber(countryCode + phoneNumber)
      ) {
        return new ReturnObjectHandler("Not valid phone number", null, 400);
      }
      //Check does user already exist with given phone number
      if (
        await UserRegisterRepository.checkDoesUserExistWithPhoneNumber(
          countryCode,
          phoneNumber
        )
      ) {
        return new ReturnObjectHandler("Phone number taken", null, 400);
      }
      //Create new User class instance, object with provided data
      const user = await UserRegisterRepository.createUserObject(false);
      if (!user) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          400
        );
      }
      //Create new UserPhoneNumber object for the newly created User object, with provided data
      const parsedPhoneNumber =
        PhoneNumberHelper.parseAndValidatePhoneNumberFromString(
          countryCode + phoneNumber
        );
      const userPhoneNumber =
        await UserRegisterRepository.createUserPhoneNumber(
          user,
          parsedPhoneNumber.getCountryCode().toString(),
          parsedPhoneNumber.getNationalNumber().toString()
        );
      if (!userPhoneNumber) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          400
        );
      }
      //Create new UserPassword object for newly created User object with provided password
      const passwordSalt = await EncryptionHelpers.generateSalt(12);
      const hashPassword = await EncryptionHelpers.hashPassword(password);
      const passwordObject =
        await UserRegisterRepository.createUserPasswordObject(
          user,
          hashPassword,
          passwordSalt
        );
      if (!passwordObject) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }

      //Create UserPublicId object for newly created User object
      const publicId = await UserRegisterRepository.createUserPublicId(user);
      if (!publicId) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }

      //Create UserSalt object for newly created User object
      const salt = await UserRegisterRepository.createUserSalt(user);
      console.log(salt);
      if (!salt) {
        return new ReturnObjectHandler(
          "Unknown error occured, could not create accout for " +
            email +
            ", please try again later",
          null,
          500
        );
      }

      publicIdReturnValue = publicId.publicId;
    }

    return new ReturnObjectHandler(
      "User is successfully registered",
      publicIdReturnValue,
      200
    );
  }
}
