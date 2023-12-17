import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, hashString } from "../utils/index.js";
import PasswordReset from "../models/PasswordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import {createJWT} from "../utils/index.js";
import FriendRequest from "../models/friendRequest.js"

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  //First to find if the user exists
  try {
    const result = await Verification.findOne({ userId });

    //So when it's succesful we need to check
    if (result) {
      const { expiresAt, token: hashedToken } = result;
      //First, if token has expired
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })

              .then(() => {
                const message = "Verification token has expired";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //If token valid
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verifieed: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email Verified Successfully";
                    res.redirect(
                      `/users/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              //INVALID TOKEN
              const message = "Verification failed or link is invalid";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid Verification Link. Please Try again later";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(err);
    res.redirect(`/users/verified?message=`);
  }
};
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found.",
      });
    }
    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has already been sent to your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    //Find baba user
    const user = await Users.findById(userId);
    if (!user) {
      const message = "Invalid password reset link, try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }
    const resetPassword = await PasswordReset.findOne({ userId });
    if (!resetPassword) {
      const message = "Invalid password reset link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }
    const { expiresAt, token: resetToken } = resetPassword;
    if (expiresAt < Date.now()) {
      const message = "Reset password link has expired. Too slow, nigguh";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);
      if (!isMatch) {
        const message = "Invalid password reset link. Try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(
          `/users/resetpassword?status=success&type=reset&id=${userId}&token=${token}`
        );
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const hashedPassword = await hashString(password);
    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });
      const message = "Password changed successfully";
      res.redirect(`/users/resetpassword?status=success&message=${message}`);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } user.password = undefined;
    res.status(200).json({
      success: true,
      user: user,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: "false",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  try{
    const {firstName, lastName, location, profileUrl, set} = req.body;
    if (!(firstName || lastName || contact || set || location)) {
      next("Provide Required Fields!");
      return;
    }
    const {userId} = req.body.user;
    const updateUser = {
      firstName, lastName, location, profileUrl, set, _id:userId,
    };
    const user = await Users.findByIdAndUpdate(userId, updateUser, {new: true,});
    await user.populate({path: "friends", select: "-password"});
    const token = createJWT(user?._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user, token,
    })

  }catch(error){
    console.log(error);
    res.status(404).json({message: error.message});
  }
};

export const friendRequest = async (req, res, next) => {
  try{
    const {userId} = req.body;

    const {requestTo} = req.body;

    const requestExists = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });
    if (requestExists) {
      next("Request already exists");
      return;
    }
    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });
    if (accountExist){
      next("Request already exists");
      return;
    }
    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });
    res.status(201).json({
      success: true,
      message: "Request sent successfully",
    });
  }catch(error){
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const {userId} = req.body.user;
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
    .populate({
      path: "requestFrom",
      select: "firstName lastName profileUrl set -password",
    }).limit(10).sort({_id: -1,});
    res.status(200).json({
      success: true,
      data: request,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  };
};

export const acceptRequest = async (req, res, next ) => {
  try {
    const id = req.body.user.userId;
    const {rid, status} = req.body;
    const requestExist = await FriendRequest.findById(rid);

    if(!requestExist){
      next("No requests here");
      return; 
    }
    const newRes = await FriendRequest.findByIdAndUpdate(
      {_id: rid},
      {requestStatus: status}
    );
    if(status === "Accepted"){
      const user = await Users.findById(id);
      user.friends.push(newRes?.requestFrom);
      await user.save();
      const friend = await Users.findById(newRes?.requestFrom);
      friend.friends.push(newRes?.requestTo);
      await friend.save();
    }
    res.status(201).json({
      success: true,
      message: "Friend request" + status,
    })
  }catch(error){
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    })
    }
};