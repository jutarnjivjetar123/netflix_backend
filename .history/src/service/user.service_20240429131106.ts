import express from "express";
import UserRepository from "../repository/user.repository";
import User from "../models/user.model";

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

    static async addNewUser(username: string, email: string, emailVerified: string, password: string, image?: string,): Promise<User | null> {
        const newUser = new User();
        newUser.username = username;
        newUser.image = image;
        newUser.email = email;
        newUser.hashedPassword = password;
        return await this.userRepository.registerUser(newUser);
    }
}
