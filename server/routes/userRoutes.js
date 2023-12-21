import express from "express";
import path from "path";
import {acceptRequest, changePassword, friendRequest, getFriendRequest, profileViews, requestPasswordReset, resetPassword, suggestedFriends, verifyEmail} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

import {getUser, updateUser} from "../controllers/userController.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail);
//PASSWORD RESET
router.post("/request-passwordreset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

//user routes
router.post("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

//friend request
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

//accept or deny request
router.post("/accept-request", userAuth, acceptRequest);

//view profile
router.post("/profile-view", userAuth, profileViews);

//suggested friends
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", (_req, res) => {
    res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

router.get("/resetpassword", (_req, res) => {
    res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

export default router;