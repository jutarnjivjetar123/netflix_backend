import { Request, Response } from "express";
import { getSession } from "next-auth/react";

import UserService from "../service/user.service";

const ServerAuth = async (req: Request, res: Response) => {
    const session = await getSession({ req });
  
    if (!session?.user?.email) { 
        return res.status(400).send({
            success: error,
            
        });
    }
};
