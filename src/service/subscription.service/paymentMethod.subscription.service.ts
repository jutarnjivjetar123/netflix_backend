import ReturnObjectHandler from "../../utilities/returnObject.utility";
import PaymentMethod from "../../models/subscription.model/paymentMethod.model";
import PaymentMethodRepository from "../../repository/subscription/paymentMethod.repository.subscription";
import validator from "validator";
import { PaymentMethodTypes } from "../../utilities/other.utility";

export default class PaymentMethodService {
  public static async createPaymentMethod(
    methodType: string,
    serviceProviderName: string,
    serviceProviderLogo: string,
    serviceProviderWebsite: string
  ) {
    if (!methodType) {
      return new ReturnObjectHandler("Method type must be provided", null);
    }

    if (!serviceProviderName) {
      return new ReturnObjectHandler(
        "Service provider name must be provided",
        null
      );
    }

    let matchingMethodType: PaymentMethodTypes = Object.values(
      PaymentMethodTypes
    ).find((type) => {
      if (type === methodType) {
        return type;
      }
    });
    if (!matchingMethodType) {
      return new ReturnObjectHandler("Method type not valid", null);
    }

    if (
      await PaymentMethodRepository.isExistingByTypeAndProvider(
        matchingMethodType,
        serviceProviderName
      )
    ) {
      return new ReturnObjectHandler(
        "Service provider " +
          serviceProviderName +
          " has an existing for type " +
          methodType,
        null
      );
    }
    const newPaymentMethod =
      await PaymentMethodRepository.createNewPaymentMethod(
        matchingMethodType,
        serviceProviderName,
        serviceProviderLogo,
        serviceProviderWebsite
      );

    if (!newPaymentMethod) {
      return new ReturnObjectHandler(
        "Failed to create new payment method",
        null
      );
    }

    return new ReturnObjectHandler(
      "Created new payment method of type: " +
        methodType +
        " for service provider " +
        serviceProviderName,
      null
    );
  }

  public static async getAll(): Promise<ReturnObjectHandler<PaymentMethod[]>> {
    const paymentMethodsArray =
      await PaymentMethodRepository.getAllPaymentMethod();
    if (paymentMethodsArray === null) {
      return new ReturnObjectHandler(
        "Failed to retrieve payment methods",
        null
      );
    }
    return new ReturnObjectHandler(
      "Found " + paymentMethodsArray.length + " records",
      paymentMethodsArray
    );
  }
}
