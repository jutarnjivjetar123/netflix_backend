import express from "express";
import UserRepository from "repository/user.repository";

export default class UserRouter {
  userRepo: UserRepository;
  constructor() {
    this.userRepo = new UserRepository();
  }
    
}
