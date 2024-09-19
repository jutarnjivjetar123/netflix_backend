import { Request, Response } from "express";
import Offer from "../../models/subscription.model/offer.model";
import OfferRepository from "../../repository/subscription/offer.repository";
import ReturnObjectHandler from "../../utilities/returnObject.utility";
//This class contains methods only meant to be used as a interface for validating input data, return data flagged as incorrect or inadequate, and return an error with accompanying code, or if it is valid, then forward that data to the next code logical module, and receive and return result of the processed input data
//              METHODS
//create new Offer
//get Offer instance by Id
//get all Offer instances

export default class OfferService {
  public static async createNewOffer(
    offerTitle: string,
    monthlyBillingAmount: number,
    maxNumberOfDevicesToDownload: number,
    maxNumberOfDevicesToWatch: number,
    maxResolution: number,
    isSpatialAudio: boolean
  ) {
    if (
      !offerTitle &&
      !monthlyBillingAmount &&
      !maxNumberOfDevicesToDownload &&
      !maxNumberOfDevicesToWatch &&
      !maxResolution &&
      !isSpatialAudio
    ) {
      return new ReturnObjectHandler("Missing required parameters", null, 400);
    }
    const result = await OfferRepository.createOffer(
      offerTitle,
      monthlyBillingAmount,
      maxNumberOfDevicesToWatch,
      maxNumberOfDevicesToDownload,
      maxResolution,
      isSpatialAudio
    );

    if (!result) {
      return new ReturnObjectHandler("Could not create a new offer", null, 400);
    }
    return new ReturnObjectHandler(
      `New offer ${offerTitle} created successfully`,
      result,
      200
    );
  }

  public static async getOfferById(offerId: number) {
    if (!offerId) {
      return new ReturnObjectHandler("Missing parameter offerId", null, 400);
    }
    if (!offerId) {
      return new ReturnObjectHandler(
        "Offer Id value cannot be smaller than 1",
        null,
        400
      );
    }
    const offer = await OfferRepository.getOfferById(offerId);
    if (!offer) {
      return new ReturnObjectHandler(
        "No offer with offerId: " + offerId + " was found",
        null,
        404
      );
    }
    return new ReturnObjectHandler(
      "Found Offer object with offerId: " +
        offerId +
        " with values: \n " +
        offer,
      offer,
      200
    );
  }

  public static async getAllOfferInstances() {
    const offers = await OfferRepository.getAllOfferInstances();
    if (offers.length < 1) { 
      return new ReturnObjectHandler("No offer was found", null, 404);
    }
    return new ReturnObjectHandler("Found " + offers.length + " offers", offers, 200);
  }
}
