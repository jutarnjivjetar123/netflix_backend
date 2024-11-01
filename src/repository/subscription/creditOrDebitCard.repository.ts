import { DatabaseConnection } from "../../database/config.database";
import CreditOrDebitCard from "../../models/subscription.model/creditOrDebitCard.paymentMethod.subscription.model";
import User from "../../models/user.model/user.model";
export default class CreditOrDebitCardService {
  public static async getCreditOrDebitCardsByUser(
    user: User
  ): Promise<CreditOrDebitCard[]> {
    return await DatabaseConnection.getRepository(CreditOrDebitCard)
      .find({
        where: {
          user: user,
        },
        relations: {
          user: true,
        },
      })
      .then((data) => {
        if (data.length === 0) {
          console.log(
            "[LOG DATA] - " +
              new Date() +
              " -> LOG::Info::Repository::Subscription::CreditOrDebitCard::getCreditOrDebitCardsByUser::No record of CreditOrDebitCard objects connected to the user with following Id: " +
              user.userId
          );
        }
        if (data.length > 0) {
          console.log(
            "[LOG DATA] - " +
              new Date() +
              " -> LOG::Info::Repository::Subscription::CreditOrDebitCard::getCreditOrDebitCardsByUser::Found " +
              data.length +
              " records of CreditOrDebitCard objects connected to the user with following Id: " +
              user.userId
          );
        }
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::CreditOrDebitCard::getCreditOrDebitCardsByUser::Failed to retrieve CreditOrDebitCard object connected to the following user with id: " +
            user.userId +
            ", because an error occurred: " +
            error.message
        );
        return null;
      });
  }

  public static async createNewCreditOrDebitCard(
    creditOrDebitCard: CreditOrDebitCard
  ) {
    creditOrDebitCard.createdAt = new Date().getTime().toString();
    return await DatabaseConnection.getRepository(CreditOrDebitCard)
      .save(creditOrDebitCard)
      .then((data) => {
        console.log(
          "[DATA LOG] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::CreditOrDebitCard::createNewCreditOrDebitCard::New CreditOrDebitCard object was successfully saved"
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Subscription::CreditOrDebitCard::createNewCreditOrDebitCard::Failed to create new CreditOrDebitCard object connected to the user with id: " +
            creditOrDebitCard.user.userId +
            ", with the following error occurring: " +
            error.message
        );
        return null;
      });
  }
}
