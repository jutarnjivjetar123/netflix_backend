import jwt from "jsonwebtoken";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

export default class JWTHelper {
  static generateToken(payload: any, expiryTime: string = "1h") {
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: expiryTime,
    });
  }

  static validateToken(token: string) {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        return "Error: token has expired";
      return "Error: " + error;
    }
  }

  static getUserSaltFromToken(token: any) {
    const decodedToken = JWTHelper.validateToken(token);
    let userSalt: string;

    if (typeof decodedToken === "string") {
      // Handle case where token is a string
      // For example, you may want to throw an error or handle it accordingly
      console.log("Token is string, with error: " + decodedToken);
      return null;
    } else {
      // Handle case where token is a JwtPayload
      userSalt = decodedToken.salt;
      console.log("User salt: " + userSalt);
    }

    return userSalt;
  }
}
