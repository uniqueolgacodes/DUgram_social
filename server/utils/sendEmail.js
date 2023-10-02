import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {v4 as uuidv4 } from "uuid";

dotenv.config();

const {AUTH_EMAIL, AUTH_PASSWORD, APP_URL} = process.env;

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", 
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,    
    },
});

export const sendVerificationEmail = async (user, res) => {
    const {_id, email, lastName} = user;
    const token = _id + uuidv4();
    const link = APP_URL + "users/verify/" + _id + "/" + token;
}