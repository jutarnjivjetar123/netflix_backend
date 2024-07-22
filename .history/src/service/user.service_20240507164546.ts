import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";

import UserRepository from "../repository/user.repository";
import User from "../models/user.model";
import Session from "../models/session.model";
import JWTHelper from "../helpers/jwtokens.helpers";
import { DatabaseConnection } from "database/config.database";

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
  }
}
