import express from "express";
import cors from "cors";
import "reflect-metadata";

import {
  initializeDatabaseConnection,
  DatabaseConnection,
} from "./database/config.database";
import UserRouter from "./routes/user/user.routes";
import DevRouter from "../src/routes/test/test.routes";
const app = express();
const port = process.env.DEFAULT_PORT || 3000;
const startDatabaseConnection = async () => {
  await initializeDatabaseConnection();
};

startDatabaseConnection();

app.use(express.json());
app.use(cors());

app.use("/user", UserRouter);
app.use("/dev", DevRouter);

app.get("/checkStatus", (req: express.Request, res: express.Response) => {
  return res.status(200).send({
    successState: true,
    message: "API is available to use",
    timestamp: new Date(),
  });
});


app.get("/listC")
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
    const region = req.params;

    res.status(200).send({});
  }
);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
