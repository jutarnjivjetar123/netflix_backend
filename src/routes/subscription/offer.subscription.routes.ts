import { Request, Response, Router } from "express";
import OfferService from "../../service/subscription.service/offer.subscription.service";
class OfferRoutes {
  router = Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      const {
        offerTitle,
        monthlyBillingAmount,
        maxNumberOfDevicesToDownload,
        maxNumberOfDevicesToWatch,
        maxResolution,
        isSpatialAudio,
      } = req.body;
      if (
        !offerTitle &&
        !monthlyBillingAmount &&
        !maxNumberOfDevicesToDownload &&
        !maxNumberOfDevicesToWatch &&
        !maxResolution &&
        !isSpatialAudio
      ) {
        return res.status(400).send({
          message: "Missing required parameters",
          timestamp: new Date(),
        });
      }
      const newOffer = await OfferService.createNewOffer(
        offerTitle,
        monthlyBillingAmount,
        maxNumberOfDevicesToDownload,
        maxNumberOfDevicesToWatch,
        maxResolution,
        isSpatialAudio
      );
      if (!newOffer) {
        return res.status(500).send({
          message: newOffer.message,
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        message: newOffer.message,
        timestamp: new Date(),
      });
    });

    this.router.get("/offers", async (req: Request, res: Response) => {
      const offers = await OfferService.getAllOfferInstances();
      if (offers.statusCode === 404) {
        return res.status(404).send({
          message: offers.message,
          offers: null,
          timestamp: new Date(),
        });
      }
      return res.status(200).send({
        message: offers.message,
        offers: offers.returnValue,
        timestamp: new Date(),
      });
    });
    this.router.get("/:offerId", async (req: Request, res: Response) => {
      const offerId = Number(req.params.offerId);
      if (!offerId) {
        return res.status(400).send({
          message: "offerId is required",
          timestamp: new Date(),
        });
      }
      if (offerId < 1 || offerId > 2147483647) {
        return res.status(400).send({
          message: "Offer Id cannot be negative value or too large number",
          timestamp: new Date(),
        });
      }
      const offer = await OfferService.getOfferById(Number(offerId));
      if (offer.statusCode === 404) {
        return res.status(404).send({
          message: "No offer with id: " + offerId + " was found",
          timestamp: new Date(),
        });
      }

      return res.status(200).send({
        message: "Offer with id: " + offerId + " was found",
        offer: offer.returnValue,
        timestamp: new Date(),
      });
    });
  }
}

export default new OfferRoutes().router;
