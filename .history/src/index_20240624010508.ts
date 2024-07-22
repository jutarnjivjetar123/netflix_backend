import express from "express";
import "reflect-metadata";

import { DatabaseConnection } from "./database/config.database";
import UserRouter from "../"


const app = express();
const port = process.env.DEFAULT_PORT || 3000;
app.use(express.json());


app.use("/users", userRouter);
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
