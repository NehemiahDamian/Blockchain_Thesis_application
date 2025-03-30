 import mongoose from "mongoose";

const diplomaSessionSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sessionName: String,
  department: String, 
  year: String, 
  createdAt: { type: Date, default: Date.now },
});

export const DiplomaSession = mongoose.model("DiplomaSession", diplomaSessionSchema);