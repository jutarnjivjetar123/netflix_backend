import * as express from "express";
import UserLoginService from "../../service/user.service/login.user.service";
import validator from "validator";

export class UserLoginRouter {
  router = express.Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.get("/check", (req: express.Request, res: express.Response) => {
      return res.status(200).send({
        successState: true,
        message: "User Router established",
        timestamp: new Date().getTime(),
      });
    });
    this.router.post(
      "/signin",
      async (req: express.Request, res: express.Response) => {
        const { email, countryCode, phoneNumber, password } = req.body;

        //Check is email or phone number with country code provided, because at least one of these values must be provided
        if (!email && !countryCode && !phoneNumber) {
          return res.status(400).send({
            message:
              "Email or phone number with national identification must be provided",
            timestamp: new Date(),
          });
        }

        if (!password) {
          return res.status(400).send({
            message: "Password must be provided",
            timestamp: new Date(),
          });
        }

        //Handle case when client wants to login with email
        if (
          (email && !countryCode && !phoneNumber) ||
          (email && countryCode && phoneNumber)
        ) {
          if (!validator.isEmail(email)) {
            return res.status(400).send({
              message: "Provided email is not valid email address",
              timestamp: new Date(),
            });
          }
          const loginResult = await UserLoginService.handleEmailLogin(
            email,
            password
          );
          //Return case when the provided email is not linked to any user
          if (loginResult.statusCode === 404) {
            return res.status(404).send({
              message: "User not found",
              timestamp: new Date(),
            });
          }

          //Return case when provided password is not valid
          if (loginResult.statusCode === 401) {
            return res.status(401).send({
              message: "Password is not correct",
              timestamp: new Date(),
            });
          }

          //Return case when User has not activated their Subscription or has not requested/verified confirmation code
          /*
          NOTE:
          This check is dependent upon two variables, that are returned inside returnValue field of loginResult (which is data type ReturnObjectHandler):
          isConfirmationCodeSent - type boolean, true if value of field isSent in database for table ConfirmationCode related to the given User is true, false otherwise
          isConfirmationCodeOrSubscription - type boolean
          Case: a) value true, when field isConfirmed is false for retrieved ConfirmationCode object for the given User, if the field is false then value of this variable will be false
          Case: b) value false, as mentioned if the ConfirmationCode isConfirmed is true, then the retrieved Subscription object field isActive is checked, which is if false, then this value is false, if true, means that server error occurred and status code of 403 could not have been returned
          */
          if (loginResult.statusCode === 403) {
            //Case a)
            if (!loginResult.returnValue.isConfirmationCodeSent) {
              return res.status(403).send({
                message:
                  "Please request confirmation code to be sent to your email, you can do this on the following link",
                redirectLink: "http://127.0.0.1:5501/singup/code/send",
                timestamp: new Date(),
              });
            }
            //Case b)
            if (loginResult.returnValue.isConfirmationCodeOrSubscription) {
              return res.status(403).send({
                message:
                  "Please verify confirmation code that has been sent to your email, you can do this on the following link",
                redirectLink: "http://127.0.0.1:5501/singup/code/verify",
                timestamp: new Date(),
              });
            }
            return res.status(403).send({
              message:
                "Please activate your subscription on the following link",
              redirectLink:
                "http://127.0.0.1:5501/signup/subscription/activate",
              timestamp: new Date(),
            });
          }
          //Return case if login fails
          if (loginResult.statusCode === 500) {
            return res.status(500).send({
              message: "We could not log you in right now, please try again",
              timestamp: new Date(),
            });
          }

          console.log(loginResult.returnValue.redirectionLink);
          return res.status(200).send({
            message: "Logged in successfully",
            accessToken: loginResult.returnValue.accessToken,
            refreshToken: loginResult.returnValue.refreshToken,
            redirectLink: loginResult.returnValue.redirectionLink,
            timestamp: new Date(),
          });
        }

        //Handle case when client wants to login with phone number

        //Handle case when client provides email and phone number to login, in this case the login process is handled like it was logged in using email
      }
    );
  }
}

export default new UserLoginRouter().router;
