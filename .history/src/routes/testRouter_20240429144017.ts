import express from "express";

const testRoute = express.Router();
testRoute.use(express.json());

testRoute.get("/", (req: express.Request, res: express.Response) => {
  return res.status(200).send("You have successfully connected to the api");
});
testRoute.get("/", (req: express.Request, res: express.Response) => { 
  return res.status(200).send({
    id: "5",
    
  });
})

export default testRoute;
