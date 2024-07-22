import express from "express";

import EncryptionHelpers from "../helpers/encryption.helper";
import User from "../models/session.model";
import UserRepository from "../repository/user.repository";
import Session from "../models/session.model";
import SessionRepository from "repository/session.repository";

export default class SessionService {
  constructor() {}

  static async generateNewSession(sessionOwner: User) {
    const newSession = new Session();
    newSession.sessionToken = EncryptionHelpers.generateSalt(12).toString();
    newSession.createdBy.id = sessionOwner.id;
    newSession.expires = new Date(Date.now() + 3600 * 1000 * 12); // Setting expiration time to 1 hour from now
    newSession.isActive = true;

    const savedSession = await SessionRepository.setNewSession(newSession);
    if (savedSession) {
      return savedSession;
    } else {
      throw new Error("Failed to generate a new session.");
    }
  }
    
    static async getSessionById(sessionId: string) { 
        return await const 
    }
}
