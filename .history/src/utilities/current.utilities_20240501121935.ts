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


    const currentUser = await UserAuthentication(req);
    if (typeof currentUser === "string") { 
        return res.status(4)
    }
    return res.status(200).json(currentUser);






  }
}
