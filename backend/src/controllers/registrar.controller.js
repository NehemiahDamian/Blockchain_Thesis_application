import User from "../models/user.model.js";
import crypto from "crypto"
import { DiplomaSession } from "../models/diploma.session.model.js";
import cloudinary from "../lib/cloudinary.js";
import { SignedDiploma } from "../models/signedDiploma.model.js"; // import SignedDiploma from "../models/signedDiploma.model.js";


export const getSignedDiploma = async (req, res) => {
  // const user = req.user._id
  try {
    // if (!user) {
    //   return res.status(400).json({ message: "You cannot make this request" });
    // }
    const departments = await SignedDiploma.distinct("department");
    const years = await SignedDiploma.distinct("expectedYearToGraduate");    
     return res.status(200).json({ departments, years });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSignedDiplomaByDepartment = async (req, res) => {
  const { department, expectedYearToGraduate } = req.query;

  try {
    const signedDiplomas = await SignedDiploma.find({ department, expectedYearToGraduate });

    // Check if the array is empty
    if (signedDiplomas.length === 0) {
      return res.status(404).json({ message: "No signed diplomas found" });
    }

    return res.status(200).json(signedDiplomas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};







//show signed diplomas in a department section 
// steps to follow
// 1. get all department in the db
//




