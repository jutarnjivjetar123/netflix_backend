import { Response, Request, Router } from "express";
import PaymentMethodService from "../../service/subscription.service/paymentMethod.subscription.service";

class PaymentMethodRouter {
  router = Router();

  constructor() {
    this.routes();
  }
  routes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      const {
        methodName,
        methodType,
        serviceProviderName,
        serviceProviderLogo,
        serviceProviderWebsite,
      } = req.body;
      const newPaymentMethod = await PaymentMethodService.createPaymentMethod(
        methodType,
        serviceProviderName,
        serviceProviderLogo,
        serviceProviderWebsite
      );
      return res.status(200).send({
        message: newPaymentMethod.message,
        timestamp: new Date(),
      });
    });

    this.router.get("/all", async (req: Request, res: Response) => {
      const paymentMethodsArray = await PaymentMethodService.getAll();

      if (!paymentMethodsArray.returnValue) {
        return res.status(500).send({
          message: "Failed to retrieve payment methods, please try again",
          timestamp: new Date(),
        });
      }

      if (paymentMethodsArray.returnValue.length === 0) {
        return res.status(404).send({
          message: "Failed to find any records for payment methods",
          timestamp: new Date(),
        });
      }
      const organizedPaymentMethods = paymentMethodsArray.returnValue.reduce(
        (acc: Record<string, any[]>, method) => {
          const { methodType } = method;
          if (!acc[methodType]) {
            acc[methodType] = [];
          }
          acc[methodType].push(method);
          return acc;
        },
        {}
      );

      return res.status(200).send({
        message: "Found " + paymentMethodsArray.returnValue.length + " records",
        paymentMethods: organizedPaymentMethods,
        timestamp: new Date(),
      });
    });
  }
}

export default new PaymentMethodRouter().router;


