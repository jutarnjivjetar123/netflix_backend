import { DatabaseConnection } from "../../database/config.database";

import Offer from "../../models/subscription.model/offer.model";

//This class serves as a interface between the database and OfferService, it is only meant to store and retrieve data directly linked to the Offer class
//  METHODS
//Create Offer - DONE
//Get Offer by Id
//Get All Offer instances

export default class OfferRepository {
  //Create new Offer instance
  public static async createOffer(
    offerTitle: string,
    offerSubtitle: string,
    monthlyBillingAmount: number,
    maxNumberOfDevicesToDownload: number,
    maxNumberOfDevicesToWatch: number,
    resolutionQuality: string,
    resolutionDescription: string,
    supportedDevices: string,
    isSpatialAudio: boolean,
    offerColor: string
  ): Promise<Offer | null> {
    const newOffer = new Offer();
    newOffer.offerTitle = offerTitle;
    newOffer.offerSubtitle = offerSubtitle;
    newOffer.monthlyBillingAmount = monthlyBillingAmount;
    newOffer.maxNumberOfDevicesToDownload = maxNumberOfDevicesToDownload;
    newOffer.maxNumberOfDevicesToWatch = maxNumberOfDevicesToWatch;
    newOffer.resolutionQuality = resolutionQuality;
    newOffer.resolutionDescription = resolutionDescription;
    newOffer.supportedDevices = supportedDevices;
    newOffer.isSpatialAudio = isSpatialAudio;
    newOffer.offerColor = offerColor;

    newOffer.createdAt = new Date().getTime().toString();
    console.log(newOffer);
    return await DatabaseConnection.getRepository(Offer)
      .save(newOffer)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::Offer::createOffer::Could not create a new Offer, error: " +
            error.message
        );
        return null;
      });
  }

  public static async getOfferById(offerId: number) {
    return await DatabaseConnection.getRepository(Offer).findOne({
      where: {
        offerId: offerId,
      },
    });
  }

  public static async getAllOfferInstances() {
    return await DatabaseConnection.getRepository(Offer).find();
  }
}
