import { NextFunction, Request, Response } from "express";
import { getSession } from "next-auth/react";
import User from "../models/user.model";
import UserService from "../service/user.service";

const UserAuthentication = async (
  req: Request,
  res: Response
): Promise<User | string> => {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    return "Not signed in";
  }

  const currentUser = await UserService.getUserByEmail(session.user.email);

  if (!currentUser) {
    return "Not signed in";
  }

  return currentUser;
};

export default UserAuthentication;
