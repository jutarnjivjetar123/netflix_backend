import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import ReturnObjectHandler from "../utilities/returnObject.utility";
dotenv.config();

export default class EmailHandler {
  private static readonly transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  public static async sendEmail(
    sentTo: string,
    subject: string,
    body: string,
    sentFrom: string = null
  ): Promise<ReturnObjectHandler<boolean>> {
    const mailOptions = {
      from: sentFrom === null ? process.env.GMAIL_EMAIL : sentFrom,
      to: sentTo,
      subject: subject,
      text: body,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Info::Helpers::EmailHandler::sendEmail::Email sent successfully, email data: \nFrom: " +
          mailOptions.from +
          "\nTo: " +
          mailOptions.to +
          "\nSubject: " +
          mailOptions.subject +
          "\nBody: " +
          mailOptions.text +
          "\nResult information message: " +
          info.response
      );
      return new ReturnObjectHandler(
        "Mail was successfully delivered",
        true,
        200
      );
    } catch (error) {
      console.log(
        "[LOG DATA] - " +
          new Date() +
          " -> LOG::Error::Helpers::EmailHandler::sendEmail::Error occurred while trying to send email, email data: \nFrom: " +
          mailOptions.from +
          "\nTo: " +
          mailOptions.to +
          "\nSubject: " +
          mailOptions.subject +
          "\nBody: " +
          mailOptions.text +
          "\nError message: " +
          error
      );
      return new ReturnObjectHandler(
        "Mail could not be delivered. Reason: " + error.message,
        false,
        400
      );
    }
  }
}
