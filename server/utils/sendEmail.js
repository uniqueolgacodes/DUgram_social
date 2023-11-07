import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {v4 as uuidv4 } from "uuid";
// import {APP_URL} from "../config/index.js";
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";

dotenv.config();

const {AUTH_EMAIL, AUTH_PASSWORD, APP_URL} = process.env;

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com", 
    port: 587,
    secure:false,
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,    
    },
    tls: {
        ciphers: 'SSLv3'
        }
});

export const sendVerificationEmail = async (user, res) => {
    const {_id, email, lastName} = user;
    const token = _id + uuidv4();
    const link = APP_URL + "/users/verify/" + _id + "/" + token;

    //Mail Options #olgacodes
    const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "DUgram: Authentication AI",
        html: `<div class="container">
        <h1>Welcome aboard, chief! Let's get this over with</h1>
        <hr>
        <h4>Boss ${lastName},</h4>
        <p>Welcome to DUgram, the AI-powered social media platform developed by #OlgaCodes. We're excited to have you on board. Please verify your email to confirm it's really you.</p>
        <p>Hurry, or not... the link <b>expires in an hour</b></p>
        <a href="${link}">Verify Email Address</a>
        <div>
            <h5>Have Fun!</h5>
            <h5>DUgram Team</h5>
        </div>
    </div>
  <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        h1 {
            color: #0838bc;
            font-size: 28px;
            margin-top: 10px;
        }

        h4 {
            color: #333;
        }

        p {
            color: #333;
            font-size: 18px;
        }

        a {
            display: inline-block;
            background-color: #000;
            color: #fff;
            padding: 14px 24px;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            margin-top: 20px;
        }

        h5 {
            color: #333;
            font-size: 16px;
            margin-top: 10px;
        }
    </style>`
    };
    try {
        const hashedToken = await hashString(token);
        const newVerifiedEmail = await Verification.create({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        if(newVerifiedEmail){
            transporter
                .sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "Verification email sent",
                        message: "Alright, we got a mission for you. The brief is in your email",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(404).json({message: "Something went wrong"})
                })
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({message: "Something went wrong"})
    }
};