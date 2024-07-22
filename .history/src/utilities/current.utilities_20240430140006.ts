import express from "express";

import ServerAuth from "./session.utilities";

export default async function handler(
  req: express.Request,
  res: express.Response
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const authe
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
