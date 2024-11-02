import { DatabaseConnection } from "../../database/config.database";
import DigitalWallet from "../../models/subscription.model/digitalWallet.paymentMethod.model";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
import PaymentMethod from "../../models/subscription.model/paymentMethod.model";
import User from "../../models/user.model/user.model";

export default class DigitalWalletRepository {
  public static async getAllDigitalWalletsByUser(
    user: User
  ): Promise<DigitalWallet[] | null> {
    return await DatabaseConnection.getRepository(DigitalWallet)
      .find({
        where: {
          user: user,
        },
        relations: {
          user: true,
          paymentMethod: true,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::DigitalWallet::getAllDigitalWalletsByUser::Found " +
            data.length +
            " DigitalWallet objects for the User with userId: " +
            user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::DigitalWallet::getAllDigitalWalletsByUser::Failed to retrieve DigitalWallet objects for the User with the following userId: " +
            user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }

  public static async createDigitalWallet(
    newDigitalWallet: DigitalWallet
  ): Promise<DigitalWallet | null> {
    return await DatabaseConnection.getRepository(DigitalWallet)
      .save(newDigitalWallet)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::DigitalWallet::createDigitalWallet::Successfully created DigitalWallet for user with id: " +
            newDigitalWallet.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::DigitalWallet::createDigitalWallet::Failed to create DigitalWallet for user with id: " +
            newDigitalWallet.user.userId +
            ", error message: " +
            error.message
        );
        return null;
      });
  }
}
