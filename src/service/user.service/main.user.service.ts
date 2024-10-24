import User from "../../models/user.model/user.model";
import UserPublicId from "../../models/user.model/publicId.model";
import UserRepository from "../../repository/user/main.user.repository";
import UserSalt from "models/user.model/salt.model";
export default class UserService {
  public static async getUserByPublicId(
    publicId: string
  ): Promise<User | null> {
    const result = await UserRepository.getUserByPublicId(publicId);
    return result;
  }
  
  public static async getUserSaltByUser(user: User): Promise<UserSalt | null> { 
    return await UserRepository.getUserSaltByUser(user);
  }
  
}
