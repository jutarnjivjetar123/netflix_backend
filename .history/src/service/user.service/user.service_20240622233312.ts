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

        let newUser: User;
        try {
            newUser = await UserRepository.createNewUser(
                username,
                email,
                password,
                firstName,
                lastName,
            );
        } catch (error) {
            throw new Error("Failed to create new user, because: " + error);
        }
        
    }
}