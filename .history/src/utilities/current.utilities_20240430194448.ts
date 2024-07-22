import express from "express";

import UserAuthentication from "./session.utilities";
import { Server } from "http";

export default async function handler(
  req: express.Request,
  res: express.Response
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
      const authenticationResult = await UserAuthentication(req, res);
      if (typeof authenticationResult === "string") { 
          
          return res.status(400).send({
              success: false,
              error: 
          })
      }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
