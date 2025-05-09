import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false
    },
    program: {
      type: String,
      required: false,
    },
    expectedYearToGraduate: {
      type: String,
      required: false,
    },
    uniqueToken: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
export const  verificationModel  = mongoose.model("verificationModel",  verificationSchema );
