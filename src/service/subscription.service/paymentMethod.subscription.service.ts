import ReturnObjectHandler from "../../utilities/returnObject.utility";
import PaymentMethodRepository from "../../repository/subscription/paymentMethod.repository.subscription";
import PaymentMethod from "../../models/subscription.model/paymentMethod.model";
import validator from "validator";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";


export default class PaymentMethodService {
  public static async createPaymentMethod(
    methodType: PaymentMethodTypes,
    providerName: string,
    providerLogo: string,
    providerWebsite: string
  ): Promise<ReturnObjectHandler<PaymentMethod | null>> {
    if (!methodType) {
      return new ReturnObjectHandler(
        "Valid method type must be provided",
        null,
        400
      );
    }
    if (!providerName) {
      return new ReturnObjectHandler(
        "Valid service provider name must be provided",
        null,
        400
      );
    }
    if (!providerLogo) {
      return new ReturnObjectHandler(
        "Valid provider logo in svg format must be provided",
        null,
        400
      );
    }
    if (!providerWebsite || !validator.isURL(providerWebsite)) {
      return new ReturnObjectHandler(
        "Valid provider website url must be provided",
        null,
        400
      );
    }

    //Check for PaymentMethod with the same type and service provider
    const existingPaymentMethod =
      (
        await PaymentMethodRepository.getPaymentMethodByTypeAndServiceProvider(
          methodType,
          providerName
        )
      ).length > 0;
    if (existingPaymentMethod) {
      return new ReturnObjectHandler(
        "Payment method " +
          methodType.toString() +
          " for provider " +
          providerName +
          " already exists",
        null,
        401
      );
    }
    const newPaymentMethod = new PaymentMethod();
    newPaymentMethod.type = methodType;
    newPaymentMethod.serviceProvider = providerName;
    newPaymentMethod.serviceProviderSvgLogo = providerLogo;
    newPaymentMethod.serviceProviderWebsite = providerWebsite;

    const createdPaymentMethod =
      await PaymentMethodRepository.createPaymentMethod(newPaymentMethod);
    if (!createdPaymentMethod) {
      return new ReturnObjectHandler(
        "Failed to create payment method",
        null,
        500
      );
    }
    return new ReturnObjectHandler(
      "Created new payment method",
      createdPaymentMethod
    );
  }

  public static async getPaymentMethodById(
    paymentMethodId: string
  ): Promise<ReturnObjectHandler<PaymentMethod>> {
    const paymentMethod = await PaymentMethodRepository.getPaymentMethodById(
      paymentMethodId
    );
    if (!paymentMethod) {
      return new ReturnObjectHandler(
        "No payment method with given id was found",
        null,
        404
      );
    }

    return new ReturnObjectHandler(
      "Found payment method with given id",
      paymentMethod,
      200
    );
  }
  public static async getAllPaymentMethods() {
    const paymentMethodsArray =
      await PaymentMethodRepository.getAllPaymentMethods();
    if (paymentMethodsArray === null) {
      return new ReturnObjectHandler(
        "Failed to search payment methods, please try again",
        null,
        500
      );
    }
    if (paymentMethodsArray.length === 0) {
      return new ReturnObjectHandler(
        "No payment methods were found",
        paymentMethodsArray,
        404
      );
    }

    return new ReturnObjectHandler(
      "Found " + paymentMethodsArray.length + " payment methods",
      paymentMethodsArray,
      200
    );
  }

  public static async deletePaymentMethodById(
    paymentMethodId: string
  ): Promise<ReturnObjectHandler<PaymentMethod | null>> {
    const paymentMethod = await PaymentMethodRepository.getPaymentMethodById(
      paymentMethodId
    );
    if (!validator.isUUID(paymentMethodId)) {
      return new ReturnObjectHandler("Id is not valid", null, 400);
    }
    if (!paymentMethod) {
      return new ReturnObjectHandler(
        "Failed to find payment method",
        null,
        404
      );
    }

    const deleteResult = await PaymentMethodRepository.deletePaymentMethod(
      paymentMethod
    );
    if (!deleteResult) {
      return new ReturnObjectHandler(
        "Failed to delete payment method",
        null,
        500
      );
    }
    return new ReturnObjectHandler(
      "Payment method was successfully deleted",
      paymentMethod,
      200
    );
  }
}
