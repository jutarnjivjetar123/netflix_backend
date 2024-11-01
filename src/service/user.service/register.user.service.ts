import { Request, Response } from "express";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import DataSanitation from "../../helpers/sanitation.helpers";
import { PhoneNumberHelper } from "../../helpers/phoneNumber.helpers";
import EncryptionHelpers from "../../helpers/encryption.helper";
import UserRegisterRepository from "../../repository/user/register.user.repository";
import UserService from "../user.service/main.user.service";
import validator from "validator";
import EmailHandler from "../../helpers/emailSender.helper";
import UserRepository from "../../repository/user/main.user.repository";
import User from "../../models/user.model/user.model";

import ConfirmationCode from "../../models/user.model/confirmationCode.model";
import Subscription from "../../models/subscription.model/subscription.model";
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

  public static async generateConfirmationCodeByPublicId(
    userPublicId: string
  ): Promise<ReturnObjectHandler<ConfirmationCode | null>> {
    //Check is userPublicId null
    if (!userPublicId) {
      return new ReturnObjectHandler(
        "Public identification must be provided",
        null,
        400
      );
    }

    //Check is userPublicId valid uuid
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        400
      );
    }

    //Get User object by the userPublicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Get ConfirmationCode by the User
    const confirmationCode =
      await UserRegisterRepository.getConfirmationCodeByUser(user);

    //Handle if the ConfirmationCode for the given User exists

    //Handle different cases in situation where the found ConfirmationCode object is not null
    if (confirmationCode) {
      //Case 1.: isSent = true and isConfirmed = false, User has not confirmed the email
      if (confirmationCode.isSent && !confirmationCode.isConfirmed) {
        return new ReturnObjectHandler(
          "Please check your inbox, and verify your subscription",
          null,
          400
        );
      }
      //Case 2.: isSent = true and isConfirmed = true, for the given User object Subscription has been confirmed
      if (confirmationCode.isSent && confirmationCode.isConfirmed) {
        return new ReturnObjectHandler(
          "For this account subscription is already verified, please log in",
          null,
          401
        );
      }
      //Case 3.: isSent = false and isConfirmed = false, this case is considered a server side error and requires for another ConfirmationCode instance to be generated and sent to the email address
      if (!confirmationCode.isSent && !confirmationCode.isConfirmed) {
        const deleteConfirmationCode = await this.deleteConfirmationCodeByUser(
          user
        );
        console.log(
          "Result of deleting ConfirmationCode via case 3: " +
            deleteConfirmationCode.returnValue
        );
        if (!deleteConfirmationCode.returnValue) {
          return new ReturnObjectHandler(
            "Failed to delete ConfirmationCode",
            null,
            500
          );
        }

        //Attempt to send email
        const userEmail = await UserRegisterRepository.getUserEmailByUser(user);
        if (!userEmail) {
          return new ReturnObjectHandler("User not found", null, 404);
        }

        //Create new ConfirmationCode by the given User
        const newConfirmationCode =
          await UserRegisterRepository.createConfirmationCodeByUser(user);
        if (!newConfirmationCode) {
          return new ReturnObjectHandler(
            "Could not create new confirmation code",
            null,
            500
          );
        }
        const emailResult = await EmailHandler.sendEmail(
          userEmail.email,
          "FakeFlix confirmation code",
          this.buildEmailContent(null, newConfirmationCode.confirmationCode)
        );

        if (!emailResult) {
          const isDeleted = await this.deleteConfirmationCodeByUser(user);
          console.log(
            "EMAIL SENDING FAILED, result of deleting second confirmation code: " +
              isDeleted.returnValue
          );
          return new ReturnObjectHandler("Failed to send email", null, 500);
        }

        //Update newly created ConfirmationCode property isSent to true
        const isIsSentUpdated = await this.updateConfirmationCodeByUser(
          user,
          null,
          true,
          null
        );
        if (!isIsSentUpdated.returnValue) {
          //Attempt to delete the ConfirmationCode
          const isDeleted = await this.deleteConfirmationCodeByUser(user);
          console.log(
            "ConfirmationCode UPDATING FAILED, result of deleting second confirmation code: " +
              isDeleted.returnValue
          );
          return new ReturnObjectHandler(
            "Failed to update ConfirmationCode",
            null,
            500
          );
        }

        return new ReturnObjectHandler(
          "New confirmation code was sent, please check your inbox",
          newConfirmationCode,
          200
        );
      }
    }

    //Handle if the ConfirmationCode for the given User does not exist
    //**TODO: Separate into new function createAndSendConfirmationCode

    //Get UserEmail by User
    const userEmail = await UserRegisterRepository.getUserEmailByUser(user);
    if (!userEmail) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Create new ConfirmationCode for the given User
    const newConfirmationCode =
      await UserRegisterRepository.createConfirmationCodeByUser(user);
    if (!newConfirmationCode) {
      return new ReturnObjectHandler(
        "Failed to send confirmation code, please try again",
        null,
        500
      );
    }

    //Try to send email
    const emailResult = await EmailHandler.sendEmail(
      userEmail.email,
      "FakeFlix confirmation code",
      this.buildEmailContent(null, newConfirmationCode.confirmationCode)
    );

    if (!emailResult.returnValue) {
      const isDeleted = await this.deleteConfirmationCodeByUser(user);
      return new ReturnObjectHandler(
        "Failed to send confirmation code via email, please try again",
        null,
        500
      );
    }

    //Try to update ConfirmationCode property isSent to true
    const isUpdatedToTrue = await this.updateConfirmationCodeByUser(
      user,
      null,
      true,
      null
    );

    if (!isUpdatedToTrue.returnValue) {
      const isDeleted = await this.deleteConfirmationCodeByUser(user);

      return new ReturnObjectHandler(
        "Failed to send confirmation code via email, please try again",
        null,
        500
      );
    }
    return new ReturnObjectHandler(
      "Confirmation code sent to your email, please check your inbox",
      newConfirmationCode,
      200
    );
  }
  //Private function, only to be used within generateConfirmationCodeByUse method, otherwise could cause faulty functioning of the system. Creates new ConfirmationCode for the given User, and if successful then send the ConfirmationCode via email address, and if that is successful then attempt to update the isSent property of the given ConfirmationCode, which if fails, is considered a server error. If this situation occurs then the newly created ConfirmationCode is deleted and User is warned that the ConfirmationCode is invalid, and to attempt to send new ConfirmationCode. But if the ConfirmationCode isSent property is properly updated, then User is notified that they have received the email containing confirmation code
  private static async createAndSendConfirmationCodeByUser(
    user: User,
    subscription: Subscription
  ) {
    //Check is User null
    if (!user) {
      return new ReturnObjectHandler("User must be provided", null, 400);
    }

    //Check is subscription null
    if (!subscription) {
      return new ReturnObjectHandler(
        "Subscription must be provided",
        null,
        400
      );
    }

    //Attempt to create new ConfirmationCode object related to the given User object
    const newConfirmationCode =
      await UserRegisterRepository.createConfirmationCodeByUser(user);
    if (!newConfirmationCode) {
      return new ReturnObjectHandler(
        "Confirmation code could not be created",
        null,
        500
      );
    }

    //Get UserEmail object related to the given User object
    const userEmail = await UserRegisterRepository.getUserEmailByUser(user);
    if (!userEmail) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Attempt to send email containing confirmation
    const emailResult = await EmailHandler.sendEmail(
      userEmail.email,
      "FakeFlix confirmation code",
      this.buildEmailContent(subscription, newConfirmationCode.confirmationCode)
    );
    return emailResult;
  }

  private static buildEmailContent(
    subscription: Subscription,
    confirmationCode: string
  ): string {
    return `
      Hello,
  
      Please use the following confirmation code to activate your subscription to FakeFlix:
      
      Subscription plan: ${subscription.offer.offerTitle}
      Plan resolution: ${subscription.offer.resolutionDescription}
      Monthly billing: ${subscription.offer.monthlyBillingAmount}
      Number of devices your household can watch on: ${
        subscription.offer.maxNumberOfDevicesToWatch
      }
      Number of devices your household can download content on: ${
        subscription.offer.maxNumberOfDevicesToDownload
      }
      ${subscription.offer.isSpatialAudio ? "Spatial audio included" : ""}
      
      Confirmation code: ${confirmationCode}
      
      If you didn't register for FakeFlix, please ignore this email.
  
      Best regards,
      FakeFlix Team
    `;
  }

  //Update ConfirmationCode object with new value, if no new values to update were given returns error
  public static async updateConfirmationCodeByUser(
    user: User,
    newConfirmationCode: string = null,
    newIsSent: boolean = null,
    newIsConfirmed: boolean = null
  ): Promise<ReturnObjectHandler<ConfirmationCode | null>> {
    //Get current ConfirmationCode by the given User
    const confirmationCode =
      await UserRegisterRepository.getConfirmationCodeByUser(user);
    if (!confirmationCode) {
      return new ReturnObjectHandler(
        "Confirmation code does not exist for the user",
        null,
        404
      );
    }

    //Check is property confirmationCode changed
    let isConfirmationCodeSet = false;
    if (newConfirmationCode) {
      if (newConfirmationCode !== confirmationCode.confirmationCode) {
        isConfirmationCodeSet = true;
      }
    }

    //Check is property isSent changed
    let isIsSentSet = false;
    if (newIsSent) {
      if (newIsSent !== confirmationCode.isSent) {
        isIsSentSet = true;
      }
    }

    //Check is property isConfirmed changed
    let isIsConfirmedSet = false;
    if (newIsConfirmed) {
      if (newIsConfirmed !== confirmationCode.isConfirmed) {
        isIsConfirmedSet = true;
      }
    }

    if (!isConfirmationCodeSet && !isIsConfirmedSet && !isIsSentSet) {
      return new ReturnObjectHandler(
        "No new values to update were given",
        null,
        400
      );
    }

    //Attempt to update the ConfirmationCode object with new values
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
      "Confirmation code updated successfully",
      updatedConfirmationCode,
      200
    );
  }

  //Function to delete ConfirmationCode for the given User object, checks does the ConfirmationCode exist
  public static async deleteConfirmationCodeByUser(user: User) {
    //Get the ConfirmationCode by the given User
    const confirmationCode =
      await UserRegisterRepository.getConfirmationCodeByUser(user);
    if (!confirmationCode) {
      return new ReturnObjectHandler(
        "No ConfirmationCode found for User",
        null,
        404
      );
    }

    //Attempt to delete the ConfirmationCode connected to the User
    const isDeleted = await UserRegisterRepository.deleteConfirmationCodeByUser(
      user
    );
    if (!isDeleted) {
      return new ReturnObjectHandler(
        "Failed to delete ConfirmationCode",
        isDeleted,
        500
      );
    }
    return new ReturnObjectHandler("ConfirmationCode deleted", isDeleted, 200);
  }

  public static async verifyConfirmationCodeByPublicId(
    userPublicId: string,
    confirmationCode: string
  ): Promise<ReturnObjectHandler<boolean>> {
    //Check is userPublicId null
    if (!userPublicId) {
      return new ReturnObjectHandler(
        "Public identification must be provided",
        false,
        400
      );
    }

    //Check is confirmationCode null
    if (!confirmationCode) {
      return new ReturnObjectHandler(
        "Confirmation code must be provided",
        false,
        400
      );
    }

    //Check is userPublicId valid UUID
    if (!validator.isUUID(userPublicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        false,
        400
      );
    }

    //Check is confirmation code composed only of numbers and is length equal to 6
    if (
      confirmationCode.length !== 6 &&
      !validator.isNumeric(confirmationCode)
    ) {
      return new ReturnObjectHandler(
        "Confirmation code must be 6 characters in length and composed only of numbers",
        false,
        400
      );
    }

    //Get User related to the given userPublicId
    const user = await UserService.getUserByPublicId(userPublicId);
    if (!user) {
      return new ReturnObjectHandler("User not found", false, 404);
    }

    //Get ConfirmationCode by the given User
    const confirmationCodeFromTheDatabase =
      await UserRegisterRepository.getConfirmationCodeByUser(user);
    if (!confirmationCodeFromTheDatabase) {
      return new ReturnObjectHandler(
        "User has not requested confirmation code",
        false,
        409
      );
    }

    //Compare confirmationCode value provided by the client with the one retrieved from the database
    if (confirmationCode !== confirmationCodeFromTheDatabase.confirmationCode) {
      return new ReturnObjectHandler(
        "Confirmation code is not valid",
        false,
        401
      );
    }

    //Update ConfirmationCode property isConfirmed from the database to true
    const isUpdated = await this.updateConfirmationCodeByUser(
      user,
      null,
      null,
      true
    );
    if (!isUpdated.returnValue) {
      const isDeleted = await this.deleteConfirmationCodeByUser(user);
      if (!isDeleted.returnValue) {
        return new ReturnObjectHandler(
          "Could not delete confirmation code",
          false,
          500
        );
      }

      return new ReturnObjectHandler(
        "Could not validate code, please try sending code to the email again and try to verify it again",
        false,
        500
      );
    }
    return new ReturnObjectHandler(
      "Code is correct, you can start using our service's",
      true,
      200
    );
  }
}
