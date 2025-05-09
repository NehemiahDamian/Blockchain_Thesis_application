import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    IpfsUrl: {
      type: String,
      required: true,
      trim: true,
    },
    studentToken: {
      type: String, // Store image path or URL
      required: true,
    },
    program: {
      type: String, 
      required: true,
    },
    college: {
      type: String, 
      required: true,
    },
    expectedYearToGraduate: {
      type: String, 
      required: true,
    },

  },
  { timestamps: true }
);

const Archive = mongoose.model("Archive", archiveSchema);
export default Archive;