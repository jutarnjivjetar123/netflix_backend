import express from "express";
import "reflect-metadata";

import {
  initializeDatabaseConnection,
  DatabaseConnection,
} from "./database/config.database";
import UserRouter from "../src/routes/user/user.routes";
import validator from "validator";
import DataSanitazion from "./helpers/sanitazion.helpers";

const app = express();
const port = process.env.DEFAULT_PORT || 3000;
const startDatabaseConnection = async () => {
  await initializeDatabaseConnection();
};

startDatabaseConnection();

app.use(express.json());

app.use("/user", UserRouter);

app.get("/checkStatus", (req: express.Request, res: express.Response) => {
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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

console.log(
  "TEST EMAIL: " +
    "function removeAllWhitespaces(input: string): string {
      // Remove leading and trailing whitespaces using trim()
      const trimmedInput = input.trim();
      // Remove all internal whitespaces
      const noInternalWhitespaces = trimmedInput.replace(/\s+/g, '');
      return noInternalWhitespaces;
  }
  " +
    " sanitazion:" +
    DataSanitazion.sanitazeEmailData(
      "test.user+malicious@example.com <img src=x onerror=alert('XSS')>"
    )
);
