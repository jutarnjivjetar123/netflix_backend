import { ExpressAuth } from ("@auth/express");

import("@auth/express/providers/github");
import express from "express";


const app = express();

app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth)