import express from "express";

const testRoute = express.Router();
testRoute.use(express.json());

testRoute.get("/", (req: express.Request, res: express.Response) => {
  return res.status(200).send("You have successfully connected to the api");
});
testRoute.get("/dog", (req: express.Request, res: express.Response) => {
  return res
    .set("Access-Control-Allow-Origin", "http://localhost:3001").set("Access-Control-Allow-Origin", "http://localhost:3001")
    .status(200)
    .send({
      id: "5",
      name: "Bruno",
      image:
        "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
    });
});

export default testRoute;
