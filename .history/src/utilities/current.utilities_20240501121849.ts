import express from "express";

import UserAuthentication from "./session.utilities";
import { Server } from "http";

export default async function CurrentUserSessionHandler(
  req: express.Request,
  res: express.Response
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  
}
