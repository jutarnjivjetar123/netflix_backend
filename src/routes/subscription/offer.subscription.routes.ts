import { Request, Response, Router } from "express";
import OfferService from "../../service/subscription.service/offer.subscription.service";
import Offer from "../../models/subscription.model/offer.model";
import { filterOffers } from "../../utilities/other.utility";
class OfferRoutes {
  router = Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      const {
        offerTitle,
        offerSubtitle,
        monthlyBillingAmount,
        maxNumberOfDevicesToDownload,
        maxNumberOfDevicesToWatch,
        resolutionQuality,
        resolutionDescription,
        supportedDevices,
        isSpatialAudio,
        offerColor
      } = req.body;
      if (
        !offerTitle &&
        !offerSubtitle &&
        !monthlyBillingAmount &&
        !maxNumberOfDevicesToDownload &&
        !maxNumberOfDevicesToWatch &&
        !resolutionQuality &&
        !resolutionDescription &&
        !supportedDevices &&
        !isSpatialAudio &&
        !offerColor
      ) {
        return res.status(400).send({
          message: "Missing required parameters",
          timestamp: new Date(),
        });
      }
      const newOffer = await OfferService.createNewOffer(
        offerTitle,
        offerSubtitle,
        monthlyBillingAmount,
        maxNumberOfDevicesToDownload,
        maxNumberOfDevicesToWatch,
        resolutionQuality,
        resolutionDescription,
        supportedDevices,
        isSpatialAudio,
        offerColor
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
      const offersResult = await OfferService.getAllOfferInstances();
      if (offersResult.statusCode === 404) {
        return res.status(404).send({
          message: offersResult.message,
          offers: null,
          timestamp: new Date(),
        });
      }
      //Modify the return structure of the Offer object array to not include createdAt and modifiedAt properties
      const offers: Offer[] = offersResult.returnValue;
      const filteredOffers = filterOffers(offers);

      return res.status(200).send({
        message: offersResult.message,
        offers: filteredOffers,
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
