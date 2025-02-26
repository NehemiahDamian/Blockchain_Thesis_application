import mongoose from "mongoose"
import User from "../models/user.model.js"
import StudentRequest from "../models/student.request.model.js";
// import { generateToken } from "../lib/utils.js";

export const requestDiploma = async (req, res) => {
  const requester = req.user._id;
    //TODO Edit the request based on system analyst informations
  try {
    const user = await User.findById(requester);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.fullName || !user.idNumber || !user.email) {
      return res.status(400).json({ message: "Please edit your profile" });
    }

    if (user.numberofRequest > 3) {
      return res.status(400).json({ message: "You can only request a diploma up to 3 times." });
    }

    const newRequest = new StudentRequest({
      fullName: user.fullName,
      idNumber: user.idNumber,
      email: user.email,
    });

    await newRequest.save();
    // generateToken(user._id, res)

    return res.status(201).json({ message: "Diploma request submitted successfully", request: newRequest });

  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const UpdateInfo= async (req, res) =>{
  try {

    
  } catch (error) {
    
  }
}

