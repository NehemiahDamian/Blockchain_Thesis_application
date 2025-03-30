import User from "../models/user.model.js";
import crypto from "crypto"
import { DiplomaSession } from "../models/diploma.session.model.js";
import { SignedDiploma } from "../models/signedDiploma.model.js"; 

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
  const { students, esignatures } = req.body;  // ✅ Extract esignatures properly
  const privateKey = req.user.privateKey;

  if (!students || students.length === 0) {
    return res.status(400).json({ message: "No students found" });
  }

  if (!privateKey) {
    return res.status(401).json({ message: "Dean's private key is missing." });
  }

  try {
    const data = students.map((element, index) => {
      const sign = crypto.createSign("SHA256");

      // Only sign essential fields for stability
      const contentToSign = `${element.fullName}-${element.idNumber}-${element.email}`;
      sign.update(contentToSign);
      sign.end();

      const digitalSignature = sign.sign(privateKey, "hex");

      return {
        ...element,
        signedByDean: req.user.fullName,
        deanDigitalSignature: digitalSignature,
        deanESignature: Array.isArray(esignatures) ? esignatures[index] || null : esignatures,
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

  const updatedUser = await User.findByIdAndUpdate(userId, 
    {esignature:esignature},
    {new:true})

    res.status(200).json(updatedUser)


}

// export const getDigitallySigned = async (req, res) => {
//   const id = req.user._id;
  
//   // attributes of the diploma with e-signature
//   const { signedDiplomas } = req.body;

//   try {
//     const dean = await User.findById(id);
//     if (!dean) {
//       return res.status(400).json({ message: "Dean not found" });
//     }

//     const deanPrivateKey = dean.privateKey.trim(); //  no extra spaces

//     const unsignedDiplomas = signedDiplomas.filter(
//       (diploma) => !diploma.signedByDean
//     );

//     if (unsignedDiplomas.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No unsigned diplomas found to sign." });
//     }


//     // Digitally sign each diploma using the dean's private key
//     const digitallySignedDiplomas = unsignedDiplomas.map((diploma) => {
//       const sign = crypto.createSign("SHA256"); // Use SHA256 for signing
//       sign.update(JSON.stringify(diploma)); // Convert diploma to string before signing
//       sign.end(); // Finish signing process

//       const digitalSignature = sign.sign(deanPrivateKey, "hex"); // Sign and convert to hex

//       return {
//         ...diploma,
//         signedByDean: dean.name, 
//         digitalSignature, 
//         signedAt: new Date(), 
//       };
//     });

//     await DiplomaNewDb.insertMany(digitallySignedDiplomas);

//     return res.status(200).json({ message: "Diplomas digitally signed successfully!" });
//   } catch (error) {
//     console.error("Error signing diplomas:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
