import express from "express";

import ServerAuth from "./session.utilities";
import { Server } from "http";

export default async function handler(
  req: express.Request,
  res: express.Response
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const authenticationResult = await ServerAuth(req, res);

    // Check the authentication result
    if (!authenticationResult.success) {
      // If authentication failed, return the error response
      return res.status(400).send(authenticationResult);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
