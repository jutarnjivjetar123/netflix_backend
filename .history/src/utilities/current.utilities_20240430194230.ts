import express from "express";

import {
  UserAuthentication,
  isResponse,
  isResponseOrUser,
} from "./session.utilities";
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
    if (isResponse(authenticationResult)) {
      return authenticationResult;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
