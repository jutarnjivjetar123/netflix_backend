import User from "../../models/user.model/user.model";
import Subscription from "../../models/subscription.model/subscription.model";
import Offer from "../../models/subscription.model/offer.model";
import PaymentDevice from "../../models/subscription.model/paymentDevice.model";

import UserService from "../user.service/main.user.service";

import ReturnObjectHandler from "../../utilities/returnObject.utility";
import SubscriptionRepository from "../../repository/subscription/subscription.subscription.repository";
import OfferService from "../subscription.service/offer.subscription.service";
import PaymentDeviceService from "./paymentDevice.subscription.service";
