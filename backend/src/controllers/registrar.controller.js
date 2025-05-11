import User from "../models/user.model.js";
import crypto from "crypto"
import { DiplomaSession } from "../models/diploma.session.model.js";
import cloudinary from "../lib/cloudinary.js";
import { SignedDiploma } from "../models/signedDiploma.model.js"; // import SignedDiploma from "../models/signedDiploma.model.js";
import { AuditLogs } from "../models/audit.logs.model.js";

export const getSignedDiploma = async (req, res) => {
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

    // Convert array to object format for easier frontend consumption
    const formattedResult = {};
    result.forEach(item => {
      formattedResult[item.department] = item.years;
    });

    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSignedDiplomaByDepartment = async (req, res) => {
  const { department, expectedYearToGraduate } = req.query;

  try {
    const signedDiplomas = await SignedDiploma.find({ department, expectedYearToGraduate });

    if (!signedDiplomas || signedDiplomas.length === 0) {
      return res.status(404).json({ message: "No signed diplomas found" });
    }
    // await AuditLogs.create({
    //   user: req.user.fullName,
    //   action: "getSignedDiplomaByDepartment",
    //   timestamp: new Date(),
    //   details: {
    //     department,
    //     expectedYearToGraduate
    //   },
    //   userRole: req.user.role,
    // });

    return res.status(200).json(signedDiplomas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addEsignature = async (req, res) => {
   const {esignature} = req.body
    const userId = req.user._id
  
    try {
      if(!userId){
        return res.status(400).json({message:"E Signature is required"})
      }
      // cloudinary
      const uploadResponse = await cloudinary.uploader.upload(esignature);
      const updatedUser = await User.findByIdAndUpdate(userId, 
        {esignature:uploadResponse.secure_url},
        {new:true})

        // await AuditLogs.create({
        //   user: req.user.fullName,
        //   action: "getSignedDiplomaByDepartment",
        //   timestamp: new Date(),
        //   details: {
        //     department,
        //     expectedYearToGraduate
        //   },
        //   userRole: req.user.role,
        // });
    
        res.status(200).json(updatedUser)
      
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}

export const getEsignature = async (req, res) =>{
  const userId = req.user._id

  try {
    const registrar = await User.findById(userId)
    if(!registrar){
      return res.status(400).json({message:"user not found"})
    }
    const signature  = registrar.esignature
    const fullname = registrar.fullName
    res.status(200).json({ message: "Success", data: { signature, fullname } });
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal Server error"})
  }
}


export const digitalSignature = async (req, res) => {
  const { students, esignatures } = req.body;
  const privateKey = req.user.privateKey;

  if (!students || students.length === 0) {
    return res.status(400).json({ message: "No students found" });
  }

  if (!privateKey) {
    return res.status(401).json({ message: "Dean's private key is missing." });
  }

  try {
    const updateOperations = students.map((element) => {
      const sign = crypto.createSign("SHA256");
      const contentToSign = `${element.fullName}-${element.idNumber}-${element.email}`;
      sign.update(contentToSign);
      sign.end();
      const digitalSignature = sign.sign(privateKey, "hex");

      // Create update operation for each student
      return {
        updateOne: {
          filter: { _id: element._id }, // Assuming each student object has an _id
          update: {
            $set: {
              registrarDigitalSignature: digitalSignature,
              registrarESignature: esignatures,
              signedAt: new Date()
            }
          }
        }
      };
    });

    // Perform bulk update
    const result = await SignedDiploma.bulkWrite(updateOperations);

    // await AuditLogs.create({
    //   user: req.user.fullName,
    //   action: "digitalSignature",
    //   timestamp: new Date(),
    //   details: {
    //     students: students.map(student => ({
    //       id: student._id,
    //       registrarDigitalSignature: student.registrarDigitalSignature,
    //       registrarESignature: student.registrarESignature
    //     }))
    //   },
    //   userRole: req.user.role,
    // });

    res.status(200).json({
      message: "Diplomas updated with signatures successfully",
      data: result
    });
  } catch (error) {
    console.error("Signing error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }

}





