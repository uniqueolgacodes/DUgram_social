import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //Validate fields
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Oops, this human is registered already");
      return;
    }
    const hashedPassword = await hashString(password);
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
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //Validation for logging in
    if (!email || !password) {
      next("Chief, valid credentials please?");
      return;
    }

    //Find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      next("You got one of them wrong...or both");
      return;
    }

    if (!user?.verified) {
      next(
        "Chief, you're not verified. Check your email, click that link and let's go!"
      );
      return;
    }

    //If it's verified, then we can compare passwords
    const isMatch = await compareString(password, user?.password);

    //Then the checker for if it matches or not
    if (!isMatch) {
      next("You got one of them wrong...or both");
      return;
    }

    //If it does, then we can send back the JWT
    user.password = undefined;
    const token = createJWT(user?._id);

    res.status(201).json({
      status: true,
      message: "Login Successful!",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
