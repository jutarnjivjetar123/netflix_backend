import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";

import UserRepository from "../repository/user.repository";
import User from "../models/user.model";
import Session from "../models/session.model";
import SessionManager from "../helpers/session.helpers";

export default class UserService {
  constructor() {}

  static async addNewUser(
    username: string,
    email: string,
    password: string,
    image?: string
  ): Promise<User | string> {
    if (!username) {
      return "Username is required";
    }
    if (!email) {
      return "Email is required";
    }
    if (!password) {
      return "Password is required";
    }

    const hashedPassword = await EncryptionHelpers.hashPassword(password);

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.hashedPassword = hashedPassword;
    newUser.image = image;
    newUser.emailVerified = new Date();
    newUser.salt = (await EncryptionHelpers.generateSalt(12)).toString();
    const newUserResult = await UserRepository.addNewUser(newUser);

    if (!newUserResult) return "Error registering new user";

    return newUserResult;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const user = UserRepository.getUserByEmail(email);
    return user;
  }

  static async loginUser(username: string, email: string, password: string) {
    if (!username || !email) {
      console.log("LOG::USER SERVICE::loginUser::Missing username or email");
      return null;
    }

    if (!password) {
      console.log("LOG::USER SERVICE::loginUser::Missing password");
      return null;
    }

    let user = await UserRepository.getUserByUsername(username);

    if (!user) user = await UserRepository.getUserByEmail(email);
    if (!user) {
      console.log(
        "LOG::USER SERVICE::loginUser::User with email: " +
          email +
          " and username: " +
          username +
          " not found"
      );
      return null;
    }

    const passwordComparisonResult = EncryptionHelpers.validatePassword(
      password,
      user.hashedPassword
    );
    if (!passwordComparisonResult) {
      console.log("LOG::USER SERVICE::loginUser::Invalid password provided");
      return null;
    }

    const activeSessionCheck =
      await SessionManager.getCurrentSessionForUserByEmail(email);
    if (activeSessionCheck) {
      console.log(
        "LOG::USER SERVICE::loginUser::User " +
          user.username +
          " has an already active session, is logged in"
      );
      return {
        success: true,
        userLoggedIn: true,
        userData: {
          username: user.username,
          email: user.email,
          image: user.image,
        },
        activeSession: {
          sessionId: activeSessionCheck.id,
          token: activeSessionCheck.token,
          expires: activeSessionCheck.expires,
        },
      };
    }

    const newSession = SessionManager.generateNewSessionByEmail(email);

    if (!newSession) {
      console.log(
        "LOG::USER SERVICE::loginUser::Generating new session for user : " +
          user.username +
          " has failed"
      );
      return null;
    }

    return {
      success: true,
      userLoggedIn: false,
      userData: {
        username: user.username,
        email: user.email,
        image: user.image,
      },
      activeSession: {
        token: activeSessionCheck.token,
        expires: activeSessionCheck.expires,
      },
    };
  }

  static async logoutUser(
    email: string,
    sessionToken: string
  ): Promise<boolean> {
    const activeSession = SessionManager.getCurrentSessionForUserByEmail(email);
    if (!activeSession) {
      console.log(
        "LOG::USER SERVICE::logoutUser::No active session has been found"
      );
      return false;
    }
    const sessionValidation =
      await SessionManager.validateSessionBySessionToken(sessionToken);

    if (!sessionValidation) {
      console.log(
        "LOG::USER SERVICE::logoutUser::Session with token: " +
          sessionToken +
          " validation failed"
      );
      return false;
    }
    const userLogout = await SessionManager.destroySessionBySessionToken(
      sessionToken
    );
    if (!userLogout) {
      console.log(
        "LOG::USER SERVICE::logoutUser::Session with token: " +
          sessionToken +
          " couldn't be destroyed"
      );
      return false;
    }
    return true;
  }
}
