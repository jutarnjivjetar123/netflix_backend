import { Request, Response } from "express";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import DataSanitation from "../../helpers/sanitation.helpers";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import EncryptionHelpers from "../../helpers/encryption.helper";
import UserRegisterRepository from "../../repository/user/register.user.repository";
import UserService from "../user.service/main.user.service";
import validator from "validator";
import SubscriptionService from "../../service/subscription.service/subscription.subscription.service";
import PaymentDeviceService from "../../service/subscription.service/paymentDevice.subscription.service";
export default class UserRegisterService {
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

  //Function to provide necessary data for User when confirming Subscription
  public static async getRegistrationDataByUserPublicId(userPublicId: string) {
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler("Public Id not valid");
    }

    //Get User associated with given publicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get Subscription (and Offer and PaymentDevice in relation with the Subscription object) for given User object

    const subscription = await SubscriptionService.getSubscriptionByUser(user);
    if (!subscription) {
      return new ReturnObjectHandler(
        "User does not have an relation with Subscription object",
        null,
        401
      );
    }
    return new ReturnObjectHandler(
      "Found relation for given User with an existing Subscription object",
      {
        publicId: userPublicId,
        subscription: {
          offerName: subscription.returnValue.offer.offerTitle,

          cost: subscription.returnValue.monthlyCost,
          maxNumberOfDevicesToDownload:
            subscription.returnValue.offer.maxNumberOfDevicesToDownload,
          maxNumberOfDevicesToWatch:
            subscription.returnValue.offer.maxNumberOfDevicesToWatch,
          maxResolution: subscription.returnValue.offer.maxResolution,
          expiresAt: subscription.returnValue.expiresAt,
        },
      },
      200
    );
  }

  //Function used to dismiss registration, it deletes Subscription and PaymentDevice related to the found User
  public static async dismissRegistrationByPublicId(publicId: string) {
    if (!validator.isUUID(publicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        200
      );
    }

    //Get User object related to the UserPublicId with userPublicId based on the provided publicId
    const user = await UserService.getUserByPublicId(publicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get Subscription object related to the found User object
    const subscription = await SubscriptionService.getSubscriptionByUser(user);
    if (!subscription.returnValue) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
    }
    //Get PaymentDevice related to the given Subscription
    const paymentDevice = subscription.returnValue.paymentDevice;
    if (!paymentDevice) {
      return new ReturnObjectHandler(
        "Payment device is not available",
        null,
        401
      );
    }

    return new ReturnObjectHandler(
      "All tests passed, subscription has been dismissed",
      "Success",
      200
    );
  }
}
