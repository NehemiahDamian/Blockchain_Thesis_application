import jwt from "jsonwebtoken"

export const generateToken = (userId, res) =>{
const token = jwt.sign({userId}, process.env.JWT_SECRET ,{expiresIn:"7d",});

res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 *60*1000, //MS 
  httpOnly:true, //prevent xss
  sameSite:"strict", // prevents CSRF attacks
  secure:process.env.NODE_ENV !== "development" // will check if secure like http or https
})
return token;
};

