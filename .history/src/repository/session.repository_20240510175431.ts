import JWTHelper from "helpers/jwtokens.helpers";
import { DatabaseConnection } from "../database/config.database";
import Session from "../models/session.model";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";
import ReturnObjectHandler from "../utilities/handlers/return.handler.utility";

export default class SessionRepository {
  constructor() {
    DatabaseConnection.initialize()
      .then(() => {
        console.log(
          "Database connection for Session Repository has been successfully initialized."
        );
      })
      .catch((error) =>
        console.log(
          "Error initializing database connection for Session Repository, error: " +
            error
        )
      );
  }

  static async generateNewSession(
    newSession: Session
  ): Promise<Session | null> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const sessionGenerationResult = await sessionRepository.save(newSession);
    if (!sessionGenerationResult) return null;
    return newSession;
  }

  static async validateSessionBySessionToken(
    sessionToken: string
  ): Promise<ReturnObjectHandler> {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: {
        token: sessionToken,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!session) {
      return ReturnObjectHandler.ReturnError("Session not found");
    }
    let currentDateTime = Date.now();
    if (session.expires.getTime() < currentDateTime) {
      return ReturnObjectHandler.ReturnError("Session has expired");
    }

    const decodedToken = JWTHelper.validateToken(sessionToken);
    let userSalt: string;

    if (typeof decodedToken === "string") {
      // Handle case where token is a string
      // For example, you may want to throw an error or handle it accordingly
      console.log("Token is string, with error: " + decodedToken);
      return ReturnObjectHandler.ReturnError("Token is invalid");
    } else {
      // Handle case where token is a JwtPayload
      userSalt = decodedToken.salt;
      console.log("User salt: " + userSalt);
    }

    return ReturnObjectHandler.ReturnSuccessObjectAndMessage(
      "Session has been validated successfully",
      session
    );
  }

  static async destroySessionBySessionToken(sessionToken: string) {
    const sessionRepository = DatabaseConnection.getRepository(Session);
    const currentSession = await sessionRepository.findOne({
      where: {
        token: sessionToken,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!sessionRepository) {
      return ReturnObjectHandler.ReturnError("User not logged in");
    }

    
  }
}
