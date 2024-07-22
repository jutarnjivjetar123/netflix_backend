import Session from "../models/session.model";
import { DatabaseConnection } from "../database/config.database";


export default class SessionRepository { 

    constructor() { 
        try {
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