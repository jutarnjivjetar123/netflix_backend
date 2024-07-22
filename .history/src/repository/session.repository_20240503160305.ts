import Session from "../models/session.model";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwtokens.helpers";
import { DatabaseConnection } from "../database/config.database";
export default class SessionRepository { 
  constructor() { 
    DatabaseConnection.initialize()
    .then(() =>
      console.log(
        "New connection to Session repository on the database successfully initialized"
      )
    )
    .catch((error) =>
      console.log("Error initializing database connection", error)
    );
} catch (error) {
  console.log("Error initializing a new User Repository", error);
}
  }
}