import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
// import {APP_URL} from "../config/index.js";
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";
import PasswordReset from "../models/PasswordReset.js";
import emailjs from '@emailjs/browser';

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
  host: `smtp-mail.outlook.com`,
  port:587,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationEmail = async (user, res) => {
  const { _id, email, lastName } = user;
  const token = _id + uuidv4();
  const link = APP_URL + "/users/verify/" + _id + "/" + token;
  const templateParams = {
    to_name: email,
    from_name: AUTH_EMAIL,
    message_html: `Hello ${lastName}, please click on the link to verify your email address: <a href="${link}">Verify Email Address</a>`,
    link: {link},
  };

  //Mail Options #olgacodes
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "DUgram: Authentication AI",
    html: `Hello ${lastName}, please click on the link to verify your email address: <a href="${link}">Verify Email Address</a>`,
  };
  try {
    const hashedToken = await hashString(token);
    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    
    if (newVerifiedEmail) {

      // function sendEmail() {
      //   // e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it
      //   const templateParams = {
      //     to_name: email,
      //     from_name: AUTH_EMAIL,
      //     message_html: `Hello ${lastName}, please click on the link to verify your email address: <a href="${link}">Verify Email Address</a>`,
      //     link: {link},
      //   };
    
      //   emailjs.send('service_09j4mkj', 'template_3k2wta5', templateParams, 'XHfQUQXg032hCTZFx')
      //     .then((result) => {
      //        console.log(result.text)
      //     }, (error) => {
      //         console.log(error.text);
      //     });
      // }

      // emailjs.send('service_09j4mkj', 'template_3k2wta5', templateParams, 'XHfQUQXg032hCTZFx')
      // sendEmail()
      transporter.sendMail(mailOptions).then(() => {
          res.status(201).send({
            status: "Verification email sent",
            message:
              "Alright, we got a mission for you. The brief is in your email",
          });
        })
        .catch((err) => {
          console.log("Transporter error:", err);
          res.status(404).json({
            status: "Failed",
            message: "Something went wrong in the transporter",
          });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong everywhere" });
  }
};
export const resetPasswordLink = async (user, res) => {
  const { _id, email } = user;
  const token = _id + uuidv4();
  const link = APP_URL + "users/reset-password/" + _id + "/" + token;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Reset Password!",
    html: ` <div class="container" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">Forgot Password</h2>
        <p style="color: #555555;">Hey, forgetful fella,</p>
        <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <a class="button" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;" href=${link}>Reset Password</a>
        <div class="footer" style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #cccccc; text-align: center; color: #777777;">
            <p>If you're having trouble clicking the "Reset Password" button, copy and paste the following link into your web browser: ${link}</p>
        </div>
    </div>`,
  };
  try {
    const hashedToken = await hashString(token);
    const resetEmail = await PasswordReset.create({
      userId: _id,
      email: email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });
    if (resetEmail) {
      transporter.sendMail(mailOptions)
      .then(() => {
          res.status(201).send({
            status: "PENDING",
            message: "Reset token has been sent to your account",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Something went wrong in the transporter" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong everywhere" });
  }
};
