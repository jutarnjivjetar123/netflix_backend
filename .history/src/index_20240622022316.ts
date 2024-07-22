import express from "express";

const app = express();
const port = process.env.DEFAULT_PORT || 3000;

app.get("/checkStatus", (req: express.Request, res: express.Response) => {

  return res.status(200).send()

});
