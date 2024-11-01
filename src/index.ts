import express from "express";
import cors from "cors";
import "reflect-metadata";
import userLoginRoutes from "./routes/user/login.user.routes";
import registerRoutes from "./routes/user/register.user.routes";
import offerRoutes from "./routes/subscription/offer.subscription.routes";
import subscriptionRoutes from "./routes/subscription/subscription.subscription.routes";
import creditOrDebitCardRoutes from "./routes/subscription/creditOrDebitCard.paymentMethod.subscription.routes";
import EmailHandler from "./helpers/emailSender.helper";
import paymentMethodRoutes from "./routes/subscription/paymentMethod.subscription.routes";

import nodemailer from "nodemailer";
import ms from "ms";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import {
  initializeDatabaseConnection,
  DatabaseConnection,
} from "./database/config.database";
import UserLoginRouter from "./routes/user/login.user.routes";
import { PhoneNumberUtil } from "google-libphonenumber";
import JWTHelper from "./helpers/jwtokens.helpers";
const app = express();
const port = process.env.DEFAULT_PORT || 3000;
const startDatabaseConnection = async () => {
  await initializeDatabaseConnection();
};

startDatabaseConnection();

app.use(express.json());
app.use(cors());
app.use("/user/register", registerRoutes);
app.use("/user/login", userLoginRoutes);
app.use("/offer", offerRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/payment/method", paymentMethodRoutes);
app.use("/payment/cardoption", creditOrDebitCardRoutes);
app.get("/check/status", (req: express.Request, res: express.Response) => {
  return res.status(200).send({
    successState: true,
    message: "API is available to use",
    timestamp: new Date(),
  });
});

app.get(
  "/dev/database/setup",
  (req: express.Request, res: express.Response) => {
    DatabaseConnection.initialize()
      .then(() => {
        return res.status(200).send({
          successState: true,
          message: "Database is online",
          timestamp: new Date(),
        });
      })
      .catch((err) => {
        return res.status(200).send({
          successState: true,
          message: "Database not setup, error: " + err,
          timestamp: new Date(),
        });
      });
  }
);

app.get(
  "/settings/languagesList",
  (req: express.Request, res: express.Response) => {
    res.status(200).send({});
  }
);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.post("/dev/sendEmail", (req: express.Request, res: express.Response) => {
  EmailHandler.sendEmail(
    "mahirkeran69@gmail.com",
    "Test message",
    "This is test email message for FakeFlix service"
  );

  return res.status(200).send({
    message: "Email sent",
    timestamp: new Date(),
  });
});

app.post("/dev/createJWT", (req: express.Request, res: express.Response) => {
  const { payload, expiresAt } = req.body;

  console.log(payload);
  console.log(expiresAt);
  if (!/^\d{13}$/.test(expiresAt)) {
    return res.status(400).send({
      message: "Expires in must be set in UNIX milliseconds format",
      timestamp: new Date(),
    });
  }
  if (new Date().setMinutes(new Date().getMinutes() + 15) > Number(expiresAt)) {
    return res.status(400).send({
      message:
        "Token expiry date and time must be set at least 15 minutes from the current timestamp",
      timestamp: new Date(),
    });
  }
  console.log(expiresAt - new Date().getTime());
  const newToken = jwt.sign(
    {
      test: "test",
    },
    "1234",
    {
      expiresIn: `${expiresAt - new Date().getTime()}ms`,
    }
  );
  return res.status(200).send({
    message: "Token processed",
    token: newToken,
    timestamp: new Date(),
  });
});
