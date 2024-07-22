import express from "express";
import UserRepository from "repository/user.repository";

export default class UserRouter {
  userRepo: 
  constructor() {
    this.userRepo = new UserRepository();
  }
}
