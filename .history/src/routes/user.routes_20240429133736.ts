import express from "express";
import UserRepository from "../repository/user.repository";
import UserService from "service/user.service";

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
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        error: "Email is required",
      });
    }

    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser)
      return res.status(422).send({
        success: false,
        message: "Email " + email + " already taken",
      });
    
    const createdUser = await UserService.addNewUser(
      username,
      email,
      password,
      image
    );

    if (typeof createdUser === "string") { 
      return res.status(400).send({
        success: false,
        error: createdUser,
      })
    }

    
    return res.status(200).send({
      success: true,
      message: "New user with username: " + createdUser.username + " was registerd"
    });
  }
);

export default userRoute;
