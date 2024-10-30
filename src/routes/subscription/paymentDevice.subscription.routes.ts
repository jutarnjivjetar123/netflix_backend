import { Request, Response, Router } from "express";
import PaymentDeviceService from "../../service/subscription.service/paymentDevice.subscription.service";
import validator from "validator";
class PaymentDeviceRouter {
  router = Router();

  constructor() {
    this.routes();
  }

  routes() {}
}
export default new PaymentDeviceRouter().router;
