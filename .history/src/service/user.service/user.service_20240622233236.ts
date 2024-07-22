import User from "models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserRepository from "repository/user.repository/user.repository";

export default class UserService { 

    public static async createAndValidateNewUser(
        username: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<User> { 

        let newUser
        try {
            
        } catch (error) {
            
        }
    }
}