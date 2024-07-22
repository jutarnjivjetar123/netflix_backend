import express from "express";
import UserRepository from "../repository/user.repository";
import User from "../models/user.model";

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

    static async addNewUser(username: string, email: string, emailVerified: string, password: string, image?: string): Promise<User | null> {
        
        
    }
}
