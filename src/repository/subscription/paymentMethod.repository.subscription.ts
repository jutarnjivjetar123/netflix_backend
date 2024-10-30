import { DatabaseConnection } from "../../database/config.database";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
import PaymentMethod from "../../models/subscription.model/paymentMethod.model";

export default class PaymentMethodRepository {
  public static async createPaymentMethod(newPaymentMethod: PaymentMethod) {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .save(newPaymentMethod)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::createdPaymentMethod::Created new PaymentMethod object with following attributes:"
        );
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::createPaymentMethod::Failed to create new PaymentMethod with error message: " +
            error.message +
            ", with following object properties:"
        );
        console.log(newPaymentMethod);
        return null;
      });
  }

  public static async getPaymentMethodById(
    Id: string
  ): Promise<PaymentMethod | null> {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .findOne({
        where: {
          paymentMethodId: Id,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::getPaymentMethodById::Found PaymentMethod for the following Id: " +
            data.paymentMethodId +
            " with following properties: "
        );
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::getPaymentMethodById::Failed to find PaymentMethod with the following Id: " +
            Id +
            ", error message that occurred during the operation: " +
            error.message
        );
        return null;
      });
  }
  //Searches by type and serviceProvider parameters and returns if a PaymentMethod has been found
  public static async getPaymentMethodByTypeAndServiceProvider(
    methodType: PaymentMethodTypes,
    serviceProvider: string
  ): Promise<PaymentMethod[] | null> {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .find({
        where: {
          type: methodType,
          serviceProvider: serviceProvider,
        },
      })
      .then((data) => {
        console.log(
          "[LOG INFO] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::getPaymentMethodByTypeAndServiceProvider::Found " +
            data.length +
            " records with matching parameters: \ntype: " +
            methodType +
            "\nserviceProvider: " +
            serviceProvider
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG INFO] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::getPaymentMethodByTypeAndServiceProvider::Failed to find PaymentMethod for following parameters: \ntype: " +
            methodType +
            "\nserviceProvider: " +
            serviceProvider +
            "\nwith following error: " +
            error.message
        );
        return null;
      });
  }

  public static async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .find()
      .then((data) => {
        console.log(
          "[LOG INFO] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::getAllPaymentMethods::Found following number of PaymentMethod records: " +
            data.length
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG INFO] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::getAllPaymentMethods::Failed to find any PaymentMethod record with following error: " +
            error.message
        );
        return null;
      });
  }

  public static async deletePaymentMethod(
    paymentMethodToDelete: PaymentMethod
  ) {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .remove(paymentMethodToDelete)
      .then((data) => {
        console.log(
          "[LOG INFO] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::deletePaymentMethod::Removed PaymentMethod object successfully from database, object that was deleted: "
        );
        console.log(paymentMethodToDelete);
        return true;
      })
      .catch((error) => {
        console.log(
          "[LOG INFO] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::deletePaymentMethod::Failed to delete PaymentMethod object from database, error message: " +
            error.message +
            ", \nobject that was to be deleted: "
        );
        console.log(paymentMethodToDelete);
        return false;
      });
  }
}
