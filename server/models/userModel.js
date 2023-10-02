import mongoose, {Schema} from "mongoose";
//Schema
const userSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required: [true, "First Name Needed, Chief"]
        },
        lastName:{
            type: String,
            required: [true,  "Last Name, Chief?"]
        },
        email:{
            type: String,
            required: [true, "Your Email, Chief!"],
            unique: true,
        },
        password:{
            type: String,
            required:[true, "Your Password, Chief?"],
            minlength: [6, "Chief, the password is too short"],
            select: true
        },
        location:{
            type: String
        },
        profileUrl:{
            type: String
        },
        profession:{
            type: String
        },
        friends:[{
            type:Schema.Types.ObjectId, ref: "Users"
        }],
        views:[{
            type: String
        }],
        verified:{
            type:Boolean, 
            default: false
        }
    },
    {timestamps: true}
);

const Users = mongoose.model("Users", userSchema);
export default Users;