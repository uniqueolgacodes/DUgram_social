import mongoose, {Schema} from "mongoose";

const emailVerification = Schema({
    userId: String,
    token: String,
    createdAt: Date,
    expiresAt: Date,
})

const Verification = mongoose.model("Verification", emailVerificationSchema);
export default Verification; 