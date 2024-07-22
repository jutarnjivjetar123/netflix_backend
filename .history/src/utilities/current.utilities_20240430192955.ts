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

    if (authenticationResult instanceof Response) {
      if (authenticationResult.body.success) {
        // Handle successful authentication
      } else {
        // Handle authentication error
        return res.status(401).json(authenticationResult.body);
      }
    } else {
      // Handle authenticated user
      const user = authenticationResult;
      // ...
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
