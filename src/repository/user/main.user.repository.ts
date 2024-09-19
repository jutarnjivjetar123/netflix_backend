import { DatabaseConnection } from "../../database/config.database";
import User from "../../models/user.model/user.model";
import UserPublicId from "../../models/user.model/publicId.model";

export default class UserRepository {
  public static async getUserByPublicId(publicId: string) {
    const result = await DatabaseConnection.getRepository(UserPublicId)
      .findOne({
        where: {
          publicId: publicId,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        return data.user;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::Main::getUserByPublicId::An error had occured while trying to find User object connected to public Id with value: " +
            publicId +
            ", error message: " +
            error.message
        );
        return null;
      });
    console.log(result);
    return result;
  }
}
