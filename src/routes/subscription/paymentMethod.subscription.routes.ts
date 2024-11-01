import { Response, Request, Router } from "express";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
import PaymentMethodService from "../../service/subscription.service/paymentMethod.subscription.service";
import { StandardErrors } from "../../enums/StandardErrors";
import validator from "validator";
class PaymentMethodRouter {
  router = Router();

  constructor() {
    this.routes();
  }
  routes() {
    this.router.get("/types", (req: Request, res: Response) => {
      const paymentMethods = Object.values(PaymentMethodTypes).reduce(
        (acc, method) => {
          acc[method] = method.toString(); // You can set a different value if needed
          return acc;
        },
        {} as Record<string, string>
      );

      res.json(paymentMethods);
      return res.status(200).send({
        message: "Available payment method types",
        data: {
          types: {
            paymentMethods,
          },
        },
        timestamp: new Date(),
      });
    });
    this.router.post("", async (req: Request, res: Response) => {
      const {
        methodType,
        serviceProvider,
        serviceProviderSvgLogo,
        serviceProviderWebsite,
      } = req.body;

      //Check are parameters missing
      if (!methodType) {
        return res.status(400).send({
          message: "Parameter methodType is invalid",
          timestamp: new Date(),
        });
      }
      if (!serviceProvider) {
        return res.status(400).send({
          message: "Parameter serviceProvider is invalid",
          timestamp: new Date(),
        });
      }
      if (!serviceProviderSvgLogo) {
        return res.status(400).send({
          message: "Parameter serviceProviderSvgLogo is invalid",
          timestamp: new Date(),
        });
      }
      if (!serviceProviderWebsite) {
        return res.status(400).send({
          message: "Parameter serviceProviderWebsite is invalid",
          timestamp: new Date(),
        });
      }

      //Check is given method type one of the available ones
      var isValidMethod: boolean = Object.values(PaymentMethodTypes).includes(
        methodType as PaymentMethodTypes
      );

      if (!isValidMethod) {
        return res.status(400).send({
          message: "Method type is not valid",
          timestamp: new Date(),
        });
      }

      const paymentMethodReturnValue =
        await PaymentMethodService.createPaymentMethod(
          methodType as PaymentMethodTypes,
          serviceProvider,
          serviceProviderSvgLogo,
          serviceProviderWebsite
        );
      if (!paymentMethodReturnValue.returnValue) {
        return res.status(paymentMethodReturnValue.statusCode).send({
          message: paymentMethodReturnValue.message,
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        message: "New payment method created",
        data: {
          paymentMethod: paymentMethodReturnValue.returnValue,
        },
        timestamp: new Date(),
      });
    });

    this.router.get("", async (req: Request, res: Response) => {
      const paymentMethods = await PaymentMethodService.getAllPaymentMethods();
      return res.status(paymentMethods.statusCode).send({
        message: paymentMethods.message,
        data: {
          paymentMethods: paymentMethods.returnValue,
        },
        timestamp: new Date(),
      });
    });

    this.router.delete("/:id", async (req: Request, res: Response) => {
      const paymentMethodId = req.params.id;
      if (!paymentMethodId) {
        return res.status(400).send({
          message: "Failed to delete payment method",
          data: {
            errors: {
              title: StandardErrors.PARAMETERNOTPROVIDED,
              context: "Parameter id must be provided",
            },
          },
        });
      }

      if (!validator.isUUID(paymentMethodId)) {
        return res.status(400).send({
          message: "Failed to delete payment method",
          data: {
            errors: {
              title: StandardErrors.PARAMETERNOTVALIDFORMAT,
              context: "Parameter id must be in uuid format",
            },
          },
        });
      }

      const deletionResult = await PaymentMethodService.deletePaymentMethodById(
        paymentMethodId
      );
      if (deletionResult.statusCode === 404) {
        return res.status(404).send({
          message: "Failed to delete payment method",
          data: {
            errors: {
              title: StandardErrors.REASOURCENOTFOUND,
              context: "No payment method with given id was found",
            },
          },
        });
      }

      if (deletionResult.statusCode === 500) {
        return res.status(404).send({
          message: "Failed to delete payment method",
          data: {
            errors: {
              title: StandardErrors.SERVERSIDEERROR,
              context: "An error occurred on our side, please try again",
            },
          },
        });
      }

      return res.status(200).send({
        message: "Payment method was successfully deleted",
        data: {
          deletedPaymentMethod: deletionResult.returnValue,
        },
      });
    });
  }
}

export default new PaymentMethodRouter().router;
