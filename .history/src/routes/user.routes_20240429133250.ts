import express from "express";
import UserRepository from "../repository/user.repository";

const userRoute = express.Router();
userRoute.use(express.json());
const userRepository = new UserRepository();

userRoute.post(
  "/register",
  async (req: express.Request, res: express.Response) => {

    const { username, email, password, image } = req.body;
    if (!username) { 
      return res.status(400).send({
        success: false,
        error: "Username is required",
      });
      
    }
    if (!password) { 
      return res.status(400).send({
        success: false,
        error: "Password is required",
      })
    }
    if(!email){
      return res.status(400).send({
        success: false,
        error: "Email is required",
      })
    }

    const existingUser = await userRepository.getUserByEmail(email);
    
    return res.sendStatus(200);
  }
);

export default userRoute;
