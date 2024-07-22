import express from "express";

const testRoute = express.Router();
testRoute.use(express.json());

testRoute.get("/test", (req: express.Request, res: express.Response) => {
  return res.status(200).send("You have successfully connected to the api");
});


export default testRoute,