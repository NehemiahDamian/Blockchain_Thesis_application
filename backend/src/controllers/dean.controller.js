// import User from "../models/user.model.js";
// import crypto from "crypto"
// import DiplomaNewDb from "../models/SignedDiploma.js"; 

// export const getEsignature = async (req,res) =>{
//   const id = req.user._id

//   try {
//     const dean = await User.findById(id)
//     if(!dean){
//       return res.status(400).json({message:"user not found"})
//     }
//     const signature = dean.esignature
//     const fullName = dean.fullName

//     if(!signature || !fullName){
//       return res.status(200).json({ message: "Success", data: { signature, fullName } });

//     }
//     res.status(200).json({message:"success",data:{signature,fullName}})
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({message:"Internal server error"})
//   }
// }

// export const getDiplomaByDepartment = async(req,res) =>{
//   const id = req.user._id
//   try {
//     const dean = await User.findById(id)
//     if(!dean){
//       return res.status(400).json({ message: "cant find"});

//     }
//     const students = await User.find({role:"student", department:dean.department})

//     res.status(200).json({students});
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const addEsignature =  async (req,res) =>{
//   const {eSignature} = req.body
//   const userId = req.user._id

//   if(!userId){
//     return res.status(400).json({message:"E Signature is required"})
//   }
//   // cloudinary

//   const updatedUser = await User.findByIdAndUpdate(userId, 
//     {esignature:eSignature},
//     {new:true})

//     res.status(200).json(updatedUser)


// }

// export const getDigitallySigned = async (req, res) => {
//   const id = req.user._id;
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
