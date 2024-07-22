import { DatabaseConnection } from "database/config.database";
import express from "express";

const app = express();
const port = process.env.DEFAULT_PORT || 3000;

app.get("/checkStatus", (req: express.Request, res: express.Response) => {
  return res.status(200).send({
    successState: true,
    message: "API is available to use",
    timestamp: new Date(),
  });
});

app.get("/dev/database/setup", (req: express.Request, res: express.Response) => { 
  
  DatabaseConnection.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


