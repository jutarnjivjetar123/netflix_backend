import { DatabaseConnection } from "../database/config.database";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";
import Session from "../models/session.model";


export default class SessionRepository{ 

    constructor() { 
        DatabaseConnection.initialize().then(
            () => console.log("LOG::SESSION REPOSITORY::New connection to database using SessionRepository was successfully established."),
        ).catch(() => console.log("LOG::SESS"));

    }

}