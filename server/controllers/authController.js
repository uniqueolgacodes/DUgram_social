import Users from "../models/userModel.js";
import { hashedString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
    const {firstName, lastName, email, password} = req.body;

    //Validate fields
    if(!(firstName || lastName || email || password)) {
        next("Provide Required Fields!");
        return;
    }

    try {
        const userExist = await Users.findOne({email});

        if(userExists){
            next("Oops, this human is registered already");
            return;
        }
        const hashedPassword = await hashedString(password);
        const user = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        //send Verification email to user
        sendVerificationEmail(user, res);
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message });
    }
}