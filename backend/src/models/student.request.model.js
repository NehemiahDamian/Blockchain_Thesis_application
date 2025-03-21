import mongoose from "mongoose";

const studentRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    numberofRequest: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // This is the correct syntax for enabling timestamps
  }
);

const StudentRequest = mongoose.model("StudentRequest", studentRequestSchema);
export default StudentRequest;
