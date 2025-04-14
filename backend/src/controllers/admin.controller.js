import mongoose from "mongoose"
import User from "../models/user.model.js"
import StudentRequest from "../models/student.request.model.js";
// import StudentSignup from "../../../frontend/src/pages/StudentSignup.jsx";
import { DiplomaSession } from "../models/diploma.session.model.js";
// import DiplomaNewDb from "../models/SignedDiploma.js"; 
// import crypto from "crypto";


export const acceptDiploma = async (req, res) => {
  const { id } = req.params; 

  try {
    const request = await StudentRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }


    request.status = "accepted";
    request.numberofRequest++;

    await request.save();

    return res.status(200).json({
      message: "Request accepted, please show this receipt to the registrar upon going to the campus",
      request: request 
    });

  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
};

export const getDiplomaRequest = async() =>{
  try {
    const request = StudentRequest.find({})
    res.status(200).json({message:"successfully retrievied", data:request})
  } catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export const rejectDiploma = async (req, res) => {
  const { id } = req.params; 

  try {
    const request = await StudentRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";

    await request.save();

    return res.status(200).json({
      message: "Please coordinate with the registrar or update your profile",
      request: request 
    });

  } catch (error) { 
    console.error(error); 
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
};



export const sendDiplomaSession = async (req, res) => {
  const { department, year, sessionName } = req.body;

  try {
    // Fetch students based on department and year
    const students = await User.find({
      role: "student",
      department,
      expectedYearToGraduate:year,
    }).select("_id");

    if (!students.length) {
      return res.status(404).json({ message: "No students found to add to session." });
    }

    const studentIds = students.map((s) => s._id);

    const session = await DiplomaSession.create({
      students: studentIds,
      sessionName,
      department,
      year,
    });

    res.status(201).json({ message: "Session created", sessionId: session._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to create session." });
  }
}





export const getDiplomaByDepartment = async (req, res) => {
  const { department, year } = req.query;

  try {
    const treamYear = year.trim()
    const students = await User.find({
      role: "student",
      department:department,
      expectedYearToGraduate:treamYear,
    });

    if (!students.length) {
      return res.status(404).json({ message: "No students found." });
    }

    res.status(200).json({ students });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error." });
  }
}

//TODO

