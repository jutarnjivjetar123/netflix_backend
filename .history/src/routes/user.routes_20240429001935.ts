import express from "express";
import UserRepository from "repository/user.repository";

const userRoute = express.Router();
userRoute.use(express.json());
userRoute.use();
testRoute.get("/generic", (req: express.Request, res: express.Response) => {
  return res.status(200).send("You have successfully connected to the api");
});

export default testRoute;
