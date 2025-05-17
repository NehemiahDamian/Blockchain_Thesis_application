import mongoose from "mongoose"
import User from "../models/user.model.js"
import StudentRequest from "../models/student.request.model.js";
import {SignedDiploma} from "../models/signedDiploma.model.js"
import { DiplomaSession } from "../models/diploma.session.model.js";
import { verificationModel } from "../models/verification.model.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';


export const getSignedDiplomaByDepartment = async (req, res) => {
  const { department, expectedYearToGraduate } = req.query;

  try {
    const signedDiplomas = await SignedDiploma.find({ department, expectedYearToGraduate });

    if (!signedDiplomas || signedDiplomas.length === 0) {
      return res.status(404).json({ message: "No signed diplomas found" });
    }


    return res.status(200).json(signedDiplomas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


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

    console.log("the",result)
    
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
//Todo

export const uploadtoArchive = async (req, res) => {
  try {
    const {
      fileUrl,
      fullName,
      program,
      expectedYearToGraduate,
      uniqueToken,
      department,
    } = req.body;

    // 🛑 Check for missing fields
    if (!fullName || !fileUrl || !uniqueToken || !program || !department || !expectedYearToGraduate) {
      return res.status(400).json({ message: "Please complete the details" });
    }

    // 🔎 Look for existing student by uniqueToken
    const student = await verificationModel.findOne({ uniqueToken });
    if (student) {
      return res.status(409).json({ message: "Student already exists" });
    }

    // ✅ Create a new student record
    const newStudent = await verificationModel.create({
      fileUrl,
      fullName,
      program,
      expectedYearToGraduate,
      uniqueToken,
      department,
    });

    // 💾 Save to database
    await newStudent.save();

    // 📬 Return response
    return res.status(201).json({ message: "Student created successfully", data: newStudent });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllstudentsArchiveByDepartment = async (req, res) => {
  try {
    const { department, year } = req.query;

    const students = await verificationModel.find({
      department: department,
      expectedYearToGraduate:year
    });

    // Always return a 200 status with an array (empty if no students found)
    const studentsArray = students.map(student => student.toObject());
    return res.status(200).json({ success: true, students: studentsArray });
  } catch (error) {
    console.log("Error in fetching departments:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getStatistics = async (req, res) => {
  try {
    const totalDiplomas = await SignedDiploma.countDocuments();
    const departmentStats = await SignedDiploma.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);
    
    const yearStats = await SignedDiploma.aggregate([
      { $group: { _id: "$expectedYearToGraduate", count: { $sum: 1 } } }
    ]);

    const numberofRequest = await StudentRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const acceptedRequest = numberofRequest.find(item => item._id === "accepted")?.count || 0;  
    const declinedRequest = numberofRequest.find(item => item._id === "declined")?.count || 0;  
    // const pendingRequest = numberofRequest.find(item => item._id === "pending")?.count || 0;
    const sessions = await DiplomaSession.find(); // Get all sessions
const sessionCount = sessions.length;

// Count the total number of students across all sessions
const totalStudentCount = sessions.reduce((acc, session) => {
  return acc + session.students.length;
}, 0);

res.json({
  totalDiplomas,
  departmentStats,
  yearStats,
  numberofRequest: [
    { status: "accepted", count: acceptedRequest },
    { status: "declined", count: declinedRequest },
  ],
  session: sessionCount,
  totalStudents: totalStudentCount // 👈 This is the total number of students across all sessions
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching statistics." });
  }
};

export const getRegisteredDean = async (req, res) => {
  try {
    const deans = await User.find({ role: "dean" }).select("fullName department email");
    if (!deans || deans.length === 0) {
      return res.status(404).json({ message: "No dean found" });
    }
    //make the data in array
    const deanArray = deans.map(dean => ({
      fullName: dean.fullName,
      department: dean.department,
      email: dean.email
    }));
    return res.status(200).json(deanArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


