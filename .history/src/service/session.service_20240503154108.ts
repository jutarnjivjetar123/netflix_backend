import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";
import User from "../models/session.model";
import UserRepository from "../repository/user.repository";
import Session from "../models/session.model";
import SessionRepository from "repository/session.repository";

export default class SessionService {
  constructor() {}

  static async generateSession(sessionOwner: User) {
    const newSession = new Session();
    newSession.expires = new Date();
    newSession.sessionToken = sessionOwner.createdBy.username;
    const newSessionResult = await SessionRepository.setNewSession(newSession);
  }
}
