import {SignedDiploma} from "../models/signedDiploma.model.js"

export const verifierLogic = async (req, res) => {
  const { alumniName, alumniCourse, dateOfBirth } = req.query;

  try {
    const student = await SignedDiploma.find({ fullName: alumniName, program: alumniCourse, dateOfBirth });

    if (!student || student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const token = student[0].uniqueToken;

    return res.status(200).json({ uniqueToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
