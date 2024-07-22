import express from "express";
import UserRepository from "../repository/user.repository";
import UserService from "../service/user.service";

const userRoute = express.Router();
userRoute.use(express.json());
const userRepository = new UserRepository();

userRoute.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const { username, email, password, image } = req.body;
    if (!username) {
      return res
        .set("Access-Control-Allow-Origin", "http://localhost:3000")
        .status(400)
        .send({
          success: false,
          error: "Username is required",
        });
    }
    if (!password) {
      return res
        .set("Access-Control-Allow-Origin", "http://localhost:3000")
        .status(400)
        .send({
          success: false,
          error: "Password is required",
        });
    }
    if (!email) {
      return res
        .set("Access-Control-Allow-Origin", "http://localhost:3000")
        .status(400)
        .send({
          success: false,
          error: "Email is required",
        });
    }

    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser)
      return res
        .set("Access-Control-Allow-Origin", "http://localhost:3000")
        .status(422)
        .send({
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
      return res
        .set("Access-Control-Allow-Origin", "http://localhost:3000")
        .status(400)
        .send({
          success: false,
          error: createdUser,
        });
    }

    return res

      .set("Access-Control-Allow-Origin", "http://localhost:3000")
      .set("Access-Control-Allow-Methods", "GET, POST, PUT")
      .status(200)
      .send({
        success: true,
        message:
          "New user with username: " + createdUser.username + " was registered",
        newUser: createdUser,
      });
  }


);

userRoute.post()

export default userRoute;
