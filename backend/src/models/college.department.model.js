import mongoose from "mongoose";

const collegeSchema =  new mongoose.Schema(
  {
    collegeName: String,
    collegeAbv:String,
  },
  {timestamp:true}
);

export const college = mongoose.model("CollegeModel", collegeSchema);
