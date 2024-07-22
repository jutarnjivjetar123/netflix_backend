import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";

import UserRepository from "../repository/user.repository";
import User from "../models/user.model";
import Session from "../models/session.model";
import SessionRepository from "../repository/session.repository";
import JWTHelper from "../helpers/jwtokens.helpers";
import { DatabaseConnection } from "database/config.database";
import { MoreThan } from "typeorm";

export default class UserService {
  private static userRepository: UserRepository;

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
    const newUserResult = await UserRepository.registerUser(newUser);

    if (!newUserResult) return "Error registering new user";

    return newUserResult;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const user = UserRepository.getUserByEmail(email);
    return user;
  }

  static async loginUser(username: string, email: string, password: string) {
    const userRepository = DatabaseConnection.getRepository(User);
    const sessionRepository = DatabaseConnection.getRepository(Session);

    const user = await userRepository.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (!user) throw Error("User does not exist");
    const passwordComparisonResult = EncryptionHelpers.validatePassword(
      password,
      user.hashedPassword
    );
    if (!passwordComparisonResult) throw Error("Password incorrect");

    const checkSessionExists = await sessionRepository.findOne({
      where: {
        createdBy: user,
        expires: MoreThan(new Date()),
      },
      relations: {
        createdBy: true,
      },
    });

    if (checkSessionExists) throw Error("User already logged in");

    const newSession = new Session();
    let currentTime = Date.now + 5 * 60 * 60 * 1000;
    newSession.expires = new Date(Date().now() + 5 * 60 * 60 * 1000);
    const newSession = await sessionRepository.save();
  }
}
