import Offer from "../models/subscription.model/offer.model";

export function filterOffers(
  offers: Offer[]
): Omit<Offer, "createdAt" | "modifiedAt">[] {
  return offers.map(({ createdAt, modifiedAt, ...rest }) => rest);
}

export enum PaymentMethodTypes {
  CREDIT_DEBIT_CARD = "Credit or Debit Card",
  DIGITAL_WALLET = "Digital wallet",
  GIFT_CARD = "Gift card",
}
