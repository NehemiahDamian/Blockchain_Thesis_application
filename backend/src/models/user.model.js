import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  email:{
    type:String,
    required:true,
    unique:true
  },
  fullName:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
    minlength:6,
  },
  idNumber: { 
    type: String, 
    unique: true, 
    sparse: true, 
    required: function () { return this.role === "student"; } // Required only for students
  },
  role:{
    type: String,
    enum:['admin', "student", "dean", "registrar","verifier"],
    required:true,
  },
  publicKey: 
  { type: String, 
    required: 
    function() 
    { 
      return this.role === "dean" || this.role === "registrar"; 
    } 
  },
  privateKey: 
  { type: String, 
    required: 
    function() 
    { 
      return this.role === "dean" || this.role === "registrar"; 
    } 
  },
}, 
{ 
  timestamps: true }
);

const User = mongoose.model("User",userSchema)

export default User;