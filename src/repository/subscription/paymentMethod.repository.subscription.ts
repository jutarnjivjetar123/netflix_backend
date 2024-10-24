import { PaymentMethodTypes } from "../../utilities/other.utility";
import { DatabaseConnection } from "../../database/config.database";
import PaymentMethod from "../../models/subscription.model/paymentMethod.model";

export default class PaymentMethodRepository {
  public static async createNewPaymentMethod(
    methodType: PaymentMethodTypes,
    serviceProviderName: string,
    serviceProviderLogo: string,
    serviceProviderWebsite: string
  ) {
    const newPaymentMethod = new PaymentMethod();
    newPaymentMethod.methodType = methodType;
    newPaymentMethod.serviceProviderName = serviceProviderName;
    newPaymentMethod.serviceProviderLogo = serviceProviderLogo;
    newPaymentMethod.serviceProviderWebsite = serviceProviderWebsite;
    return await DatabaseConnection.getRepository(PaymentMethod)
      .save(newPaymentMethod)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::Successfully created new PaymentMethod, payment method: "
        );
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::Failed to create new PaymentMethod, with error message: " +
            error.message +
            ", provided parameters: "
        );
        console.log(newPaymentMethod);
        return null;
      });
  }

  public static async isExistingByTypeAndProvider(
    type: PaymentMethodTypes,
    serviceProviderName: string
  ): Promise<boolean> {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .find({
        where: {
          methodType: type,
          serviceProviderName: serviceProviderName,
        },
      })
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::isExistingByTypeAndProvider::Found payment method for service provider" +
            serviceProviderName +
            " and type of " +
            type
        );

        return data.length > 0;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::Failed to find existing payment method for service provider " +
            serviceProviderName +
            " and type " +
            type +
            " with error: " +
            error.message
        );
        return false;
      });
  }

  public static async getAllPaymentMethod(): Promise<PaymentMethod[] | null> {
    return await DatabaseConnection.getRepository(PaymentMethod)
      .find()
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::Subscription::PaymentMethod::Found " +
            data.length +
            " PaymentMethod records"
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Subscription::PaymentMethod::Failed to find records for PaymentMethod, with error message: " +
            error.message
        );
        return null;
      });
  }
}
