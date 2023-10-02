import bycrypt from "bycryptjs";
import JWT from "jsonwebtoken";

export const hashString = async(userValue) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export const compareString = async(userPassword, password) => {
    const isMatch = await bcrypt.compare(userPassword, password);
    return isMatch;
};

//JSON WEB TOKEN
export function createJWT(id){
    return JWT.sign({userId: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    })
}