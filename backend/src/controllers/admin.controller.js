import mongoose from "mongoose"
import User from "../models/user.model.js"
import StudentRequest from "../models/student.request.model.js";
import {SignedDiploma} from "../models/signedDiploma.model.js"
import { DiplomaSession } from "../models/diploma.session.model.js";



export const acceptDiploma = async (req, res) => {
  const { id } = req.params; 
  const { reasonforAction } = req.body; // Add reason from request body

  try {
    const request = await StudentRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    request.numberofRequest++;
    request.reasonforAction = reasonforAction; // Save the reason

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

export const rejectDiploma = async (req, res) => {
  const { id } = req.params;
  const { reasonforAction } = req.body; // Add reason from request body

  try {
    const request = await StudentRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    request.reasonforAction = reasonforAction; // Save the reason

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


export const getDiplomaRequest = async (req, res) => {
  try {
    const request = await StudentRequest.find({});
    return res.status(200).json({ message: "successfully retrieved", data: request });
  } catch (error) {
    console.log("error in fetching products:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const adminGetSignedDiploma = async (req, res) => {
  try {
    const result = await SignedDiploma.aggregate([
      {
        $group: {
          _id: {
            department: "$department",
            year: "$expectedYearToGraduate"
          }
        }
      },

      {
        $group: {
          _id: "$_id.department",
          years: { $push: "$_id.year" }
        }
      },
      {
        $project: {
          department: "$_id",
          years: 1,
          _id: 0
        }
      }
    ]);
    
     const formattedResult = {}

    for(const item of result){
      formattedResult[item.department] = {};

      for(const year of item.years){

        const total = await SignedDiploma.countDocuments({
          department:item.department,
          expectedYearToGraduate:year
      });

      const signed =  await SignedDiploma.countDocuments({
        department:item.department,
        expectedYearToGraduate:year,
        deanESignature:{$exists:true, $ne: null},
        registrarESignature:{$exists:true, $ne: null}
      })

      formattedResult[item.department][year]={
        status: `${total}/${signed}`,
         raw: { signed, total }

      };


      }
    }

    res.status(200).json(formattedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStudentforBlockchainUpload = async (req, res) => {
  try {
    console.log(req.query)
    const { department, year } = req.query;
    
    const students = await SignedDiploma.find({
      department: department,
      expectedYearToGraduate:year
      
    });
    

    if (!students.length) {
      return res.status(404).json({ message: "No students found." });
    }

   return  res.status(200).json({ students });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
