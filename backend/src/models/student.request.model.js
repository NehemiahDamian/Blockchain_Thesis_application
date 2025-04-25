import mongoose from "mongoose";

const studentRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    paymentReceipt: {
      type: String, // Store image path or URL
      required: true,
    },
    affidavitOfLoss: {
      type: String, // Store image path or URL
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const StudentRequest = mongoose.model("StudentRequest", studentRequestSchema);
export default StudentRequest;