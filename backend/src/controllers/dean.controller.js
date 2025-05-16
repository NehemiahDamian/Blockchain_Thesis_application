import User from "../models/user.model.js";
import crypto from "crypto"
import { DiplomaSession } from "../models/diploma.session.model.js";
import { SignedDiploma } from "../models/signedDiploma.model.js"; 
import { AuditLogs } from "../models/audit.logs.model.js";
export const getEsignature = async (req, res) => {
  const dean = req.user; // This is already set

  try {
    const deanAuth = await User.findById(dean._id);
    
    // ❌ Wrong: if (!dean)  ✅ Correct: if (!deanAuth)
    if (!deanAuth) {
      return res.status(400).json({ message: "User not found" });
    }

    const signature = deanAuth.esignature;
    const fullName = deanAuth.fullName;

    // await AuditLogs.create({
    //   user: req.user,
    //   action: "getEsignature",
    //   timestamp: new Date(),
    //   details: {
    //     fullName: deanAuth.fullName,
    //     email: deanAuth.email,
    //     role: deanAuth.role,
    //   },
    // });

    res.status(200).json({ message: "Success", data: { signature, fullName } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// export const uploadSignarture = async (req, res) => {
//   try {
//     const { signature } = req.body;
//     const userId = req.user._id;

//     if (!signature) {
//       return res.status(400).json({ message: "signature is required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(signature);
//     const updatedUser = await User.findByIdAndUpdate(userId,{ esignature: uploadResponse.secure_url },{ new: true });

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("error in update profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


export const getDiplomaByDepartment = async (req, res) => {
  const { department } = req.query;

  try {
    // ✅ Role check
    if (req.user.role !== "dean") {
      return res.status(403).json({ message: "Access denied: Only deans can access this route." });
    }

    // ✅ Department check
    if (req.user.department !== department) {
      return res.status(403).json({ message: "Access denied: You can only access your own department." });
    }

    const session = await DiplomaSession.findOne({ department }).populate("students");

    if (!session) {
      return res.status(404).json({ message: "No diploma session found for this department." });
    }

    // await AuditLogs.create({
    //   user: req.user.fullName,
    //   action: "getDiplomaByDepartment",
    //   timestamp: new Date(),
    //   details: {
    //     department: session.department,
    //     year: session.year,
    //   },
    //   userRole: req.user.role,

    // });

    res.status(200).json({
      message: "Session found",
      data: {
        sessionId: session._id,
        sessionName: session.sessionName,
        students: session.students,
        department: session.department,
        year: session.year,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Server error while fetching session." });
  }
};



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
    // Check if any student already has signatures
    const studentsWithExistingSignatures = students.filter(student => 
      student.deanESignature || student.registrarDigitalSignature
    );

    if (studentsWithExistingSignatures.length > 0) {
      return res.status(400).json({
        message: "Some students already have signatures",
        students: studentsWithExistingSignatures.map(student => ({
          id: student.idNumber || student._id,
          name: student.fullName,
          existingDeanSignature: !!student.deanESignature,
          existingRegistrarSignature: !!student.registrarDigitalSignature
        }))
      });
    }

    const data = students.map((element) => {
      const sign = crypto.createSign("SHA256");

      // Only sign essential fields for stability
      const contentToSign = `${element.fullName}-${element.idNumber}-${element.email}-${element.department}-${element.expected}`;
      sign.update(contentToSign);
      sign.end();

      const digitalSignature = sign.sign(privateKey, "hex");

      return {
        ...element,
        signedByDean: req.user.fullName,
        deanDigitalSignature: digitalSignature,
        deanESignature: esignatures,
        signedAt: new Date(),
      };
    });

    const signedDiplomas = await SignedDiploma.insertMany(data);
    res.status(200).json({
      message: "Diplomas signed successfully",
      data: signedDiplomas,
    });
  } catch (error) {
    console.error("Signing error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addEsignature =  async (req,res) =>{

  const {esignature} = req.body
  const userId = req.user._id

  if(!userId){
    return res.status(400).json({message:"E Signature is required"})
  }
  // cloudinary

  // await AuditLogs.create({
  //   user: req.user.fullName,
  //   action: "addEsignature",
  //   timestamp: new Date(),
  //   details: {
  //     fullName: req.user.fullName,
  //     email: req.user.email,
  //   },
  //   userRole: req.user.role,
  // }); 

  const updatedUser = await User.findByIdAndUpdate(userId, 
    {esignature:esignature},
    {new:true})

    res.status(200).json(updatedUser)


}

