import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";

import UserRepository from "../repository/user.repository";
import User from "../models/user.model";

export default class UserService {
  private static userRepository: UserRepository;

  constructor() {
    
  }

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

      const userRepository = new UserRepository();
      const newUserResult = await userRepository.

  }
}
