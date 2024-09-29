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
import OfferService from "../subscription.service/offer.subscription.service";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";
import EmailHandler from "../../helpers/emailSender.helper";
import UserRepository from "repository/user/main.user.repository";
import User from "../../models/user.model/user.model";
import c from "../../../.history/src/utilities/verificationToken.utility_20240702013924";
import ConfirmationCode from "models/user.model/confirmationCode.model";
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
    if (!subscription.returnValue) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
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

    //Attempt to dismiss Subscription, by dismissing, it implies deleting Subscription and PaymentDevice object's related to the given User object
    //Attempt to find and delete the Subscription
    const isSubscriptionDeleted =
      await SubscriptionService.deleteSubscriptionByUser(user);

    if (!isSubscriptionDeleted.returnValue) {
      return new ReturnObjectHandler(
        "Failed to delete Subscription",
        null,
        400
      );
    }
    return new ReturnObjectHandler("User has unsubscribed", "Success", 200);
  }

  public static async activateSubscriptionByPublicId(userPublicId: string) {
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        400
      );
    }

    //Get User with given publicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get Subscription by User
    const subscription = await SubscriptionService.getSubscriptionByUser(user);
    if (!subscription.returnValue) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
    }

    if (subscription.returnValue.isActive) {
      return new ReturnObjectHandler(
        "Cannot activate already active subscription",
        null,
        409
      );
    }
    //Extract PaymentDevice from Subscription
    const paymentDevice = subscription.returnValue.paymentDevice;
    if (!paymentDevice) {
      return new ReturnObjectHandler("No payment device found", null, 404);
    }

    //Attempt to update Subscription attribute isDefault value to true
    const updatedSubscription =
      await SubscriptionService.updateSubscriptionByUser(
        user,
        null,
        null,
        new Date(new Date().setMonth(new Date().getMonth() + 1))
          .getTime()
          .toString(),
        true
      );
    console.log(updatedSubscription.returnValue);
    if (!updatedSubscription.returnValue) {
      return new ReturnObjectHandler(
        "Could not activate subscription, please try again",
        null,
        500
      );
    }
    return new ReturnObjectHandler(
      "Subscription is activated, enjoy Netflix",
      updatedSubscription,
      200
    );
  }

  //Function for generating confirmation code that is sent to the User email upon successful registration
  public static async generateConfirmationCodeByPublicId(userPublicId: string) {
    //Check is publicId valid
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        400
      );
    }
    //Get User object related to the UserPublicId with given userPublicId trough userId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get Subscription to the User
    const subscription = await SubscriptionService.getSubscriptionByUser(user);
    if (!subscription.returnValue) {
      return new ReturnObjectHandler("User is not subscribed", null, 401);
    }
    //Check is the Subscription activated (Subscription.isActive = true)
    if (!subscription.returnValue.isActive) {
      return new ReturnObjectHandler(
        "User has not activated their subscription",
        null,
        401
      );
    }
    //Check does found User object have an existing ConfirmationCode
    const existingConfirmationCode =
      await UserRegisterRepository.getConfirmationCodeByUser(user);

    //If the User object have an relation with ConfirmationCode object
    //Then check which of the cases are in affect
    if (existingConfirmationCode) {
      //Case #1, isSent and isConfirmed fields are both true, which means that the code was already sent and used
      if (
        existingConfirmationCode.isSent &&
        existingConfirmationCode.isConfirmed
      ) {
        return new ReturnObjectHandler("Code has been already sent", null, 409);
      }
      //Case #2, isSent is true and isConfirmed is false, which means that the code was sent, but has not been confirmed
      if (
        existingConfirmationCode.isSent &&
        !existingConfirmationCode.isConfirmed
      ) {
        return new ReturnObjectHandler(
          "Please check your mail, more likely spam, for confirmation code",
          null,
          400
        );
      }
      //Case #3, isSent and isConfirmed fields are both false, which is considered server side error, and requires that the existing ConfirmationCode be deleted, new instance of ConfirmationCode related to the given User object and the attempt be made to send the confirmation code via email
      if (
        !existingConfirmationCode.isSent &&
        !existingConfirmationCode.isConfirmed
      ) {
        //Delete the existing ConfirmationCode
        const isDeleted =
          await UserRegisterRepository.deleteConfirmationCodeByUser(user);

        //Create new ConfirmationCode object for the given User object
        if (!isDeleted) {
          return new ReturnObjectHandler("Failed to delete it", null, 500);
        }
        const newConfirmationCode =
          await UserRegisterRepository.createConfirmationCodeByUser(user);
        if (!newConfirmationCode) {
          return new ReturnObjectHandler(
            "Could not send confirmation code via email, because of some unknown error, please try again",
            null,
            500
          );
        }

        //Get UserEmail related to the given User object
        const userEmail = await UserRegisterRepository.getUserEmailByUser(user);

        if (!userEmail) {
          return new ReturnObjectHandler("User not found", null, 404);
        }
        //Attempt to send email with new ConfirmationCode
        const emailResult = await EmailHandler.sendEmail(
          userEmail.email,
          "Refreshed confirmation code for confirming registration to FakeFlix service",
          "Hello, \n Since You requested new confirmation code to be sent to your email, here it is, please use the below provided confirmation code that this was You, and to activate Subscription to FakeFlix service.\nSelected subscription plan: \n" +
            subscription.returnValue.offer.offerTitle +
            "\nMonthly billing amount: " +
            subscription.returnValue.offer.monthlyBillingAmount +
            "\n Offer details: \nNumber of supported devices to watch on: " +
            subscription.returnValue.offer.maxNumberOfDevicesToWatch +
            "\nNumber of supported devices to download on: " +
            subscription.returnValue.offer.maxNumberOfDevicesToDownload +
            "\nMaximum resolution available on the supported devices: " +
            subscription.returnValue.offer.maxResolution +
            (subscription.returnValue.offer.isSpatialAudio
              ? "\nComes with Netflix Spatial audio functionality\n"
              : "\n") +
            "\nCONFIRMATION CODE: \n" +
            "   " +
            newConfirmationCode.confirmationCode +
            "\nPlease ignore this email if You didn't register yourself to FakeFlix service\nBest regards"
        );
        if (!emailResult.returnValue) {
          return new ReturnObjectHandler(
            "Failed to send email, if you did receive any emails, the code there wil be considered invalid, so please try again",
            null,
            500
          );
        }
        const updatedConfirmationCode = await this.updateConfirmationCodeByUser(
          user,
          null,
          null,
          true
        );
        if (!updatedConfirmationCode.returnValue) {
          await this.deleteConfirmationCodeByUser(user);
          return new ReturnObjectHandler(
            "Sent Confirmation code is considered invalid, please try again",
            null,
            500
          );
        }
        return new ReturnObjectHandler(
          "Refreshed confirmation code has been sent¢",
          "TEST",
          400
        );
      }
    }
    //Attempt to create a new ConfirmationCode for the given User object
    const newConfirmationCode =
      await UserRegisterRepository.createConfirmationCodeByUser(user);
    console.log(newConfirmationCode);

    //Get UserEmail related to the given User object
    const userEmail = await UserRegisterRepository.getUserEmailByUser(user);

    if (!userEmail) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Try to send confirmation code to the provided email
    const emailResult = await EmailHandler.sendEmail(
      userEmail.email,
      "Confirmation code for confirming registration to FakeFlix service",
      "Hello, \n Your email was used to register to the FakeFlix service, please use the below provided confirmation code that this was You, and to activate Subscription to FakeFlix service.\nSelected subscription plan: \n" +
        subscription.returnValue.offer.offerTitle +
        "\nMonthly billing amount: " +
        subscription.returnValue.offer.monthlyBillingAmount +
        "\n Offer details: \nNumber of supported devices to watch on: " +
        subscription.returnValue.offer.maxNumberOfDevicesToWatch +
        "\nNumber of supported devices to download on: " +
        subscription.returnValue.offer.maxNumberOfDevicesToDownload +
        "\nMaximum resolution available on the supported devices: " +
        subscription.returnValue.offer.maxResolution +
        (subscription.returnValue.offer.isSpatialAudio
          ? "\nComes with Netflix Spatial audio functionality\n"
          : "\n") +
        "\nCONFIRMATION CODE: \n" +
        "   " +
        newConfirmationCode.confirmationCode +
        "\nPlease ignore this email if You didn't register yourself to FakeFlix service\nBest regards"
    );
    if (!emailResult.returnValue) {
      return new ReturnObjectHandler(
        "Failed to send email, please try again",
        null,
        500
      );
    }
    //Attempt to update ConfirmationCode isSent field to true
    const updatedConfirmationCode = await this.updateConfirmationCodeByUser(
      user,
      null,
      null,
      true
    );
    if (!updatedConfirmationCode.returnValue) {
      await this.deleteConfirmationCodeByUser(user);
      return new ReturnObjectHandler(
        "Sent Confirmation code is considered invalid, please try again",
        null,
        500
      );
    }
    return new ReturnObjectHandler("Email sent", emailResult, 200);
  }

  //Attempt to update ConfirmationCode with given User object
  public static async updateConfirmationCodeByUser(
    user: User,
    newConfirmationCode: string = null,
    newIsConfirmed: boolean = null,
    newIsSent: boolean = null
  ): Promise<ReturnObjectHandler<ConfirmationCode | null>> {
    if (newConfirmationCode && newIsConfirmed && newIsSent) {
      return new ReturnObjectHandler(
        "At least one value to update must be provided",
        null,
        400
      );
    }
    //Get Confirmation code to update
    const existingConfirmationCode =
      await UserRegisterRepository.getConfirmationCodeByUser(user);
    if (!existingConfirmationCode) {
      return new ReturnObjectHandler(
        "No confirmation code was found for the User with id: " + user.userId,
        null,
        404
      );
    }
    //Check is ConfirmationCode changed
    let isConfirmationCodeSet = false;
    if (!newConfirmationCode) {
      isConfirmationCodeSet = false;
    }
    if (newConfirmationCode) {
      if (
        newConfirmationCode.length === 4 &&
        newConfirmationCode !== existingConfirmationCode.confirmationCode
      ) {
        isConfirmationCodeSet = true;
      }
    }
    //Check is isSent changed
    let isIsSentSet = false;
    if (!newIsSent) {
      isIsSentSet = false;
    }
    if (newIsSent) {
      if (newIsSent !== existingConfirmationCode.isSent) {
        isConfirmationCodeSet = true;
      }
    }
    //Check is isConfirmed changed
    let isIsConfirmedSet = false;
    if (!newIsConfirmed) {
      isIsConfirmedSet = false;
    }
    if (newIsConfirmed) {
      if (newIsConfirmed !== existingConfirmationCode.isConfirmed) {
        isConfirmationCodeSet = true;
      }
    }

    if (!isConfirmationCodeSet && !isIsConfirmedSet && !isIsSentSet) {
      return new ReturnObjectHandler(
        "At least one value to update must be provided",
        null,
        400
      );
    }

    //Attempt to update ConfirmationCode
    const updatedConfirmationCode =
      await UserRegisterRepository.updateConfirmationCodeByUser(
        user,
        newConfirmationCode,
        newIsConfirmed,
        newIsSent
      );
    if (!updatedConfirmationCode) {
      return new ReturnObjectHandler(
        "Failed to update confirmation code",
        null,
        500
      );
    }
    return new ReturnObjectHandler(
      "Successfully updated confirmation code",
      updatedConfirmationCode,
      200
    );
  }

  //Attempt to delete ConfirmationCode object related to the given User
  public static async deleteConfirmationCodeByUser(
    user: User
  ): Promise<ReturnObjectHandler<boolean>> {
    //Get ConfirmationCode by the given User object
    const confirmationCode =
      await UserRegisterRepository.getConfirmationCodeByUser(user);
    if (!confirmationCode) {
      return new ReturnObjectHandler(
        "User has not requested confirmation code",
        false,
        409
      );
    }
    //Attempt to delete ConfirmationCode object with the given User object userId
    const isDeleted = await UserRegisterRepository.deleteConfirmationCodeByUser(
      user
    );
    if (!isDeleted) {
      return new ReturnObjectHandler(
        "Failed to delete ConfirmationCode",
        false,
        500
      );
    }
    return new ReturnObjectHandler(
      "Successfully deleted ConfirmationCode",
      true,
      200
    );
  }
}
