import User from "models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import UserEmail from "models/user.model/email.model";
import UserVerificationToken from "models/user.model/verificationToken.model";
import { DatabaseConnection } from "database/config.database";

export default class UserRepository { 

    public async createNewUser(username: string, email: string, password: string, firstName: string, lastName: string): Promise<User> { 
        const newUser = new User();
        newUser.username = username;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.createdAt = new Date();
        newUser.modifiedAt = new Date();

        DatabaseConnection.getRepository(User).save(newUser);

    }

}
