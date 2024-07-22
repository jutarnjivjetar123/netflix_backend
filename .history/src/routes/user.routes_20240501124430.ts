import express from "express";
import UserRepository from "../repository/user.repository";
import UserService from "../service/user.service";
import EncryptionHelpers from "../helpers/encryption.helper";
import JWTHelper from "../helpers/jwtokens.helpers";
import handler from "../utilities/current.utilities";
import CurrentUserSessionHandler from "../utilities/current.utilities";

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

userRoute.post(
  "/login",
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        error: "Email not provided",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        error: "Password not provided",
      });
    }
    const existingUser = await UserService.getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        error: "User with email " + email + " not found",
      });
    }

    const passwordComparisonResult = EncryptionHelpers.validatePassword(
      password,
      existingUser.hashedPassword
    );

    if (!passwordComparisonResult) {
      return res.status(400).send({
        success: false,
        error: "Password does not match",
      });
    }
    const userToken = JWTHelper.generateToken({
      username: existingUser.username,
      email: existingUser.email,
      salt: existingUser.salt,
    });
    res.setHeader("Authorization", "Beared " + userToken);
    return res.status(200).send({
      success: true,
      message:
        "Welcome back " + existingUser.username + " to your Netflix account",
      userData: existingUser,
    });
  }
);

userRoute.post("/logout", async (req: express.Request, res: express.Response) => {

  const { username, email, password } = req.body;

  if (!username || !email) { 
    return res.status(400).send({
      success: false,
      error: "Cannot logout, "
    });
  }
});

userRoute.get("/api/current", (req: express.Request, res: express.Response) => {

});
export default userRoute;
