import { DataSource } from "typeorm";

import User from "../models/user.model/user.model";
import UserPassword from "../models/user.model/password.model";
import UserEmail from "../models/user.model/email.model";
import UserHash from "../models/user.model/salt.model";
import UserSession from "../models/user.model/session.model";
import UserPhoneNumber from "../models/user.model/phone.model";
import UserPublicId from "../models/user.model/publicId.model";
import Offer from "../models/subscription.model/offer.model";
import PaymentDevice from "../models/subscription.model/paymentDevice.model";
import Subscription from "../models/subscription.model/subscription.model";
import ConfirmationCode from "../models/user.model/confirmationCode.model";
import PaymentMethod from "../models/subscription.model/paymentMethod.model";
export const DatabaseConnection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "SuperAdmin",
  password: "1234",
  database: "netflix_clone",
  entities: [
    User,
    UserPassword,
    UserEmail,
    UserHash,
    UserSession,
    UserPhoneNumber,
    UserPublicId,
    Offer,
    PaymentDevice,
    Subscription,
    ConfirmationCode,
    PaymentMethod,
  ],
  logging: false,
  synchronize: true,
  subscribers: [],
  migrations: [],
  uuidExtension: "uuid-ossp",
});

export const initializeDatabaseConnection = async (): Promise<void> => {
  try {
    await DatabaseConnection.initialize();
    console.log(
      new Date() +
        " -> LOG::Success::DatabaseConnection::initializeDatabaseConnection::Database connection initialized"
    );
  } catch (error) {
    console.log(
      new Date() +
        " -> LOG::Error::DatabaseConnection::initializeDatabaseConnection::Database connection initialization failed"
    );
    console.log(error);
  }
};
