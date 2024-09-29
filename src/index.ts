import express from "express";
import cors from "cors";
import "reflect-metadata";
import userRoutes from "./routes/user/login.user.routes";
import registerRoutes from "./routes/user/register.user.routes";
import offerRoutes from "./routes/subscription/offer.subscription.routes";
import subscriptionRoutes from "./routes/subscription/subscription.subscription.routes";
import paymentRoutes from "./routes/subscription/paymentDevice.subscription.routes";
import EmailHandler from "./helpers/emailSender.helper";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
import {
  initializeDatabaseConnection,
  DatabaseConnection,
} from "./database/config.database";
import UserRouter from "./routes/user/login.user.routes";
import { PhoneNumberUtil } from "google-libphonenumber";
const app = express();
const port = process.env.DEFAULT_PORT || 3000;
const startDatabaseConnection = async () => {
  await initializeDatabaseConnection();
};

startDatabaseConnection();

app.use(express.json());
app.use(cors());
app.use("/user/register", registerRoutes);
app.use("/offer", offerRoutes);
app.use("/payment", paymentRoutes);
app.use("/subscription", subscriptionRoutes);
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
