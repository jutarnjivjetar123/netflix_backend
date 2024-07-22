import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

export default class EncryptionHelpers {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async validatePassword(password, hash): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static async generateSalt(numberOfRounds: number = 12) {
    return bcrypt.genSalt(12);
  }


static generateSessionToken(length: number = 32): string {
    return bcrypt. randomBytes(length).toString("hex");
  }
}
