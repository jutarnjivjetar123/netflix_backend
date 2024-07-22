import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";

import UserRepository from "../repository/user.repository";
import User from "../models/user.model";
import Session from "../models/session.model";
import SessionManager from "../helpers/session.helpers";
import SessionHelpers from "../../.history/src/helpers/session.helpers_20240511115412";
import SessionManager from "../../.history/src/helpers/session.helpers_20240512125903";

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
        sessionExists: true,
        user: {
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

    if (!newSession) return null;

    return {
      success: true,
      sessionExists: true,
      user: {
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
}
