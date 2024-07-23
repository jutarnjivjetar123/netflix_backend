import jwt from "jsonwebtoken";
import User from "../models/user.model/user.model";
import dotenv from "dotenv";

dotenv.config();

export default class JWTHelper {
  public static generateToken(
    payload: any,
    secretKey: string = "1234",
    expiryTime: string = "1h"
  ) {
    return jwt.sign(payload, `${secretKey}-${process.env.TOKEN_SECRET}`, {
      expiresIn: expiryTime,
    });
  }
  public static isValid(token: string, secretKey: string) {
    try {
      jwt.verify(token, `${secretKey}-${process.env.TOKEN_SECRET}`);
      return true;
    } catch (error) {
      return false;
    }
  }
  public static getValidToken(token: string, secretKey: string) {
    try {
      const decodedToken = jwt.verify(
        token,
        `${secretKey}-${process.env.TOKEN_SECRET}`
      );
      return decodedToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return "Token has expired";
      }
      return "Token is invalid";
    }
  }
  public static decodeToken(token: string) {
    return jwt.decode(token);
  }
}
