import { Request, Response } from "express";
import UserLoginRepository from "../../repository/user/login.user.repository";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
import User from "../../models/user.model/user.model";
import UserService from "./main.user.service";
import UserSession from "../../models/user.model/session.model";
import EncryptionHelpers from "../../helpers/encryption.helper";
import validator from "validator";
import JWTHelper from "../../helpers/jwtokens.helpers";

export default class UserLoginService {
  //Function to handle case when the login process is initialized using email
  public static async handleEmailLogin(email: string, password: string) {
    if (!email) {
      return new ReturnObjectHandler("Email must be provided", null, 400);
    }

    if (!password) {
      return new ReturnObjectHandler("Password must be provided", null, 400);
    }

    //Get data necessary for login (objects: User, UserEmail, UserPassword, UserSalt, UserSession, Subscription)
    const loginData = await UserLoginRepository.getLoginDataByEmail(email);
    if (!loginData) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Check ConfirmationCode field isSent
    if (!loginData.confirmationCode.isSent) {
      return new ReturnObjectHandler(
        "Confirmation code has not been sent",
        {
          isConfirmationCodeSent: false,
          isConfirmationCodeOrSubscription: false,
          publicId: loginData.publicId.publicId,
        },
        403
      );
    }
    //Check ConfirmationCode field isConfirmed
    if (!loginData.confirmationCode.isConfirmed) {
      return new ReturnObjectHandler(
        "Confirmation code has not been verified",
        {
          isConfirmationCodeSent: true,
          isConfirmationCodeOrSubscription: true,
          publicId: loginData.publicId.publicId,
        },
        403
      );
    }
    //Check is User's Subscription activated (Subscription field isActive set to true)
    if (!loginData.subscription.isActive) {
      return new ReturnObjectHandler(
        "Subscription is not activated",
        {
          isConfirmationCodeSent: true,
          isConfirmationCodeOrSubscription: false,
          publicId: loginData.publicId.publicId,
        },
        403
      );
    }

    //Check is password valid

    const isValid = await EncryptionHelpers.validatePassword(
      password,
      loginData.password.hash
    );
    if (!isValid) {
      return new ReturnObjectHandler("Password is not valid", null, 401);
    }

    // Check is the UserSession retrieved from database (represented as loginData.session) null, if it is that means User has not logged in, if it is not null then check is the session expired or not (loginData.session.expiresAt is smaller then the current date and time in UNIX milis format)

    let sessionResult: ReturnObjectHandler<UserSession | null> = null;
    //Check does given User object have an existing relation with UserSession object
    //Or in less technical terms, does the logged in User have an existing nonexpired session
    if (loginData.session.sessionID !== null) {
      // Check is the given UserSession object property expiresAt smaller than value retrieved using new Date().getTime(),
      // Which corresponds to checking has the expiry date and time for the given session passed
      if (Number(loginData.session.expiresAt) <= new Date().getTime()) {
        console.log("SESSION WAS DELETED AND NEW ONE WAS CREATED");
        loginData.session.user = loginData.user;
        const deleteSession = await this.deleteUserSessionByUser(
          loginData.user
        );
        console.log("Was session deleted: " + deleteSession.returnValue);
        // TEST function to create Session
        sessionResult = await this.createUserSessionByUser(
          loginData.user,
          loginData.publicId.publicId
        );
      }
      // Check is for the given UserSession property expiresAt larger in value than the value retrieved using new Date().getTime()
      if (Number(loginData.session.expiresAt) > new Date().getTime()) {
        // If the session has not expired (loginData.session.expiresAt > new Date().getTime() === true), then the current session is extended by 30 days

        sessionResult = await this.updateUserSessionByUser(
          loginData.user,
          new Date(new Date().setMonth(new Date().getMonth() + 1))
            .getTime()
            .toString(),
          loginData.publicId.publicId
        );
        console.log(sessionResult);
        console.log("Session has not expired");
      }
    }

    //Check that serves as a second case when the retrieved UserSession object is null, the User does not have a relation with UserSession object, so a new one is created
    if (loginData.session.sessionID === null) {
      const result = await this.createUserSessionByUser(
        loginData.user,
        loginData.publicId.publicId
      );
      if (result.statusCode === 409) {
        return new ReturnObjectHandler(
          "It looks like you are already logged in",
          null,
          500
        );
      }
      if (result.statusCode !== 200) {
        return new ReturnObjectHandler(
          "We could not login you right now, please try again later",
          null,
          500
        );
      }
      sessionResult = result;
      console.log(result);
    }

    const accessToken = JWTHelper.generateToken({
      refreshToken: sessionResult.returnValue.refreshToken,
    });
    return new ReturnObjectHandler(
      "Session",
      {
        session: sessionResult,
        refreshToken: sessionResult.returnValue.refreshToken,
        accessToken: accessToken,
        redirectionLink: "http://127.0.0.1:5501/src/home.html",
      },
      200
    );
  }

  /*
  Function to create a new UserSession object for the given User
  Parameters: 
  **Required:
  - user: User, User object to whom the UserSession object has a one to one relation
  - expiresAt: string, default value is 30 days in UNIX milis format, minimum provided value must be current time + 15min
  - publicId: string, value which will be used to generate refresh token
  NOTE: value provided in the expiresAt, will be the same amount of time that refresh token will last
  Returns NULL value if the update was not completed
  Returns NULL value if there is existing UserRelation object in relation with provided User object
  Returns new UserSession object if the operation was successful
  */
  public static async createUserSessionByUser(
    user: User,

    publicId: string,
    expiresAt: string = new Date()
      .setMonth(new Date().getMonth() + 1)
      .toString()
  ) {
    //Check is expiresAt value UNIX milliseconds timestamp
    if (!/^\d{13}$/.test(expiresAt)) {
      return new ReturnObjectHandler(
        "expiresAt parameter must be in UNIX milliseconds format",
        null,
        400
      );
    }
    const timestamp = parseInt(expiresAt, 10);
    const date = new Date(timestamp);
    if (date.getTime() !== timestamp) {
      return new ReturnObjectHandler(
        "expiresAt parameter must be in UNIX milliseconds format",
        null,
        400
      );
    }

    //Check is expiresAt value smaller than current time + 15m
    if (
      new Date().setMinutes(new Date().getMinutes() + 15) > Number(expiresAt)
    ) {
      return new ReturnObjectHandler(
        "Session expiry time must be at least 15 minutes from the current system time",
        null,
        400
      );
    }

    //Check is provided publicId a valid uuid
    if (!validator.isUUID(publicId)) {
      return new ReturnObjectHandler(
        "Public identification is not valid",
        null,
        400
      );
    }

    //Check is there existing UserSession object for the given User
    if (await UserLoginRepository.checkForUserSessionByUser(user)) {
      return new ReturnObjectHandler(
        "User has already an existing relation with UserSession",
        null,
        409
      );
    }

    //Get salt for the given User
    const salt = await UserService.getUserSaltByUser(user);
    if (!salt) {
      return new ReturnObjectHandler(
        "Salt not found, server error occurred",
        null,
        500
      );
    }
    //Attempt to create new session
    const session = await UserLoginRepository.createSessionByUser(
      user,
      publicId,
      salt.salt
    );
    if (!session) {
      return new ReturnObjectHandler(
        "Failed to create new UserSession object",
        null,
        400
      );
    }
    return new ReturnObjectHandler(
      "New UserSession created successfully",
      session,
      200
    );
  }

  /*
  Function to delete a retrieved UserSession object for the given User from the database
  Parameters: 
  **Required:
  - user: User, User object to whom the UserSession object has a one to one relation
  NOTE: Searches for object UserSession which has a relation with the provided User object, if it does not find it returns ReturnObjectHandler with adequate message with false value set as returnValue
  Returns ReturnObjectHandler with true if the object was successfully deleted
  Returns ReturnObjectHandler with false if the operation of deleting found UserSession object from the database fails

  */
  public static async deleteUserSessionByUser(
    user: User
  ): Promise<ReturnObjectHandler<boolean>> {
    //Get UserSession object related to the given User
    const session = await UserLoginRepository.getUserSessionByUser(user);
    if (!session) {
      return new ReturnObjectHandler(
        "No UserSession found for given User",
        false,
        404
      );
    }

    //Attempt to delete UserSession object for the given User object
    const deleteOperationResult = await UserLoginRepository.deleteUserSession(
      session
    );
    if (!deleteOperationResult) {
      return new ReturnObjectHandler(
        "Could not delete UserSession",
        false,
        500
      );
    }

    return new ReturnObjectHandler("UserSession was deleted", true, 200);
  }

  /*
  Function to update UserSession object for the given User provided in the parameters
  Parameters: 
  **Required:
  - user: User, User object to whom the UserSession object has a one to one relation
  ***Semi - Optional
  - expiresAt: string, string value representing date and time on which will session be considered expired, stored in UNIX milliseconds
  - publicId: string, string value representing publicId which is used to identify User in external communications, and is used as payload in refresh token
  NOTE: Semi - Optional parameters, means that at least one of the parameters must be not null for the function to be executed
  Returns NULL value if the update was not completed
  Returns NULL if there is no UserSession object found that has relation with the provided User
  Returns updated UserSession  if the operation was successful
  */
  public static async updateUserSessionByUser(
    user: User,
    expiresAt: string = null,
    publicId: string = null
  ): Promise<ReturnObjectHandler<UserSession | null>> {
    //Check are both of the parameters expiresAt and refreshToken null
    if (!expiresAt && !publicId) {
      return new ReturnObjectHandler(
        "At least one of the parameters must be not null",
        null,
        400
      );
    }

    //Check is expiresAt3 not null, to execute other checking functions
    if (expiresAt !== null) {
      //Check is expiresAt value UNIX milliseconds timestamp
      if (!/^\d{13}$/.test(expiresAt)) {
        return new ReturnObjectHandler(
          "expiresAt parameter must be in UNIX milliseconds format",
          null,
          400
        );
      }
      const timestamp = parseInt(expiresAt, 10);
      const date = new Date(timestamp);
      if (date.getTime() !== timestamp) {
        return new ReturnObjectHandler(
          "expiresAt parameter must be in UNIX milliseconds format",
          null,
          400
        );
      }

      //Check is expiresAt value smaller than current time + 15m
      if (
        new Date().setMinutes(new Date().getMinutes() + 15) > Number(expiresAt)
      ) {
        return new ReturnObjectHandler(
          "Session expiry time must be at least 15 minutes from the current system time",
          null,
          400
        );
      }
    }

    let newRefreshToken = null;
    //Check is publicId not equal to null along with expiresAt, so that new refresh token can be generated, expiry date and time for refresh token is set same as the session expiry date and time
    if (publicId !== null && expiresAt !== null) {
      //Get UserSalt related to the User which is used to encrypt the token
      const userSalt = await UserService.getUserSaltByUser(user);
      //Check is refreshToken a valid JWT token

      console.log(
        "Refresh token expiry date and time stamp: " +
          new Date(Number(expiresAt)).toLocaleString()
      );
      console.log("Current date and time: " + new Date().toLocaleString());
      console.log(
        "Date and time of token expiry in UNIX milliseconds format: " +
          expiresAt
      );
      console.log(
        "Current date and time in UNIX milliseconds format: " +
          new Date().getTime()
      );
      console.log(
        "Date time difference in milliseconds: " +
          (Number(expiresAt) - new Date().getTime())
      );
      console.log(
        "Date time difference in minutes: " +
          (Number(expiresAt) - new Date().getTime()) / 60
      );

      let dateTimeDifferenceBetweenNowAndExpiryTime =
        Number(expiresAt) - new Date().getTime();
      newRefreshToken = JWTHelper.generateToken(
        {
          id: publicId,
        },
        userSalt.salt,
        `${dateTimeDifferenceBetweenNowAndExpiryTime}ms`
      );
    }
    //Get UserSession by User
    const session: UserSession = await UserLoginRepository.getUserSessionByUser(
      user
    );

    if (!session) {
      return new ReturnObjectHandler(
        "No UserSession found for User",
        null,
        404
      );
    }

    //Check is property expiresAt updated in value
    let isExpiresAtSet: boolean = false;
    if (expiresAt !== null) {
      if (session.expiresAt !== expiresAt) {
        isExpiresAtSet = true;
      }
    }

    //Check is new refreshToken generated
    let isRefreshTokenSet = false;
    if (publicId !== null) {
      if (newRefreshToken !== null) {
        if (session.refreshToken !== newRefreshToken) {
          isRefreshTokenSet = true;
        }
      }
    }
    //Check is any of the provided values updated
    if (!isExpiresAtSet && !isRefreshTokenSet) {
      return new ReturnObjectHandler(
        "No values were provided to update",
        null,
        409
      );
    }

    //Attempt to update UserSession with new values
    const updatedSession = await UserLoginRepository.updateUserSession(
      session,
      user,
      newRefreshToken,
      expiresAt
    );
    if (!updatedSession) {
      return new ReturnObjectHandler("Failed to update session", null, 500);
    }

    return new ReturnObjectHandler("Session was updated", updatedSession, 200);
  }
}
