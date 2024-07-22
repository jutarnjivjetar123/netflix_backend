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
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error,
    });
  }
}
