import Offer from "../models/subscription.model/offer.model";

export function filterOffers(
  offers: Offer[]
): Omit<Offer, "createdAt" | "modifiedAt">[] {
  return offers.map(({ createdAt, modifiedAt, ...rest }) => rest);
}
