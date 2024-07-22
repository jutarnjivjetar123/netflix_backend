import Session from "../models/session.model";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwtokens.helpers";

export default class SessionRepository { 
  constructor() { 
    DatabaseConnection.initialize()
    .then(() =>
      console.log(
        "New connection to User repository on the database successfully initialized"
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