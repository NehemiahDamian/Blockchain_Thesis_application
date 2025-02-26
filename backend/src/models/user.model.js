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
    unique:true,
    sparse: true,
    required: function () { return this.role === "student"; } 
  },
  role:{
    type: String,
    enum:['admin', "student", "dean", "registrar","verifier"],
    required:true,
  },
  uniqueToken: {
    type: String,
    sparse: true,
    required: function () { return this.role === "student" }
  },
  
  publicKey: 
  { type: String, 
    sparse: true, 
    required: 
    
    function() 
    { 
      return this.role === "dean" || this.role === "registrar"; 
    } 
  },
  esignature: { 
    type:String, 
  },

  program: {
    type: String,
    required: function () { return this.role === "student" }
  },
  

  department:{
    type:String,
    required:true,
    sparse: true, // ✅ Allows multiple null values

  },

  privateKey: 
  { type: String, 
    sparse: true, 
    required: 
    function() 
    { 
      return this.role === "dean" || this.role === "registrar"; 
    } 
  },
}, 
{ 
  timestamps: true 
}
);

userSchema.pre("save", function (next) {
  if ((this.role === "dean" || this.role === "registrar") && !this.isNew && !this.esignature) {
    return next(new Error("Dean and Registrar must upload a document before updating!"));
  }
  next();
});

const User = mongoose.model("User",userSchema)

export default User;