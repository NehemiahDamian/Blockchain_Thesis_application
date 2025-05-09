import mongoose from "mongoose"
import User from "../models/user.model.js"
import { generateKeyPair } from "../lib/generateKeys.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import { v4 as uuidv4 } from 'uuid';

export const signup = async(req,res) =>{
  const{fullName, email, password, role, idNumber,department, program, expectedYearToGraduate, dateOfBirth} = req.body

  try {
    const existingUser = await User.findOne({email})
    
    if(existingUser){return res.status(400).json({message:"user already exist"})}
    
    
    if(role === "student" & !idNumber){
      return res.status(400).json({message:"Id number is required"})
    }

    let sToken = null
    if(role === "student"){
       sToken = uuidv4();
    }
    

    let publicKey = null
    let privateKey = null

    if(role === "dean" || role === "registrar" ){
      ({ publicKey, privateKey } = generateKeyPair());
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser =  new User(
      { fullName, 
        email, 
        password:hashedPassword, 
        role, 
        idNumber, 
        publicKey, 
        privateKey,
        uniqueToken:sToken ,
        department,
        program,
        expectedYearToGraduate,
        dateOfBirth,
      });

    if(newUser){
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id:newUser._id,
        fullName, 
        email, 
        role: newUser.role, 
        uniqueToken:sToken,
        department,
        program,
        expectedYearToGraduate,
        idNumber: newUser.idNumber, // 🔥 Add this
        dateOfBirth,

      });
      
    } else {
      return res.status(400).json({message:"Invalid user data"})
    }
  } catch (error) {
    console.log("the error", error.message)
    res.status(500).json({message:"server error"})
  }
}

export const login = async (req,res) =>{
  const{fullName, email, password, role, idNumber,department} = req.body
  try {
    const user = await User.findOne({email})
    if(!user){return res.status(400).json({message:"error error error"})}
    if(user.role !== role){
      return res.status(400).json({message:"you are not allowed to access this page"})
    }

    const hashedPassword = await bcrypt.compare(password, user.password)

    if(!hashedPassword){return res.status(400).json({message:"error error error"})}

    generateToken(user._id,res)

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role, // ✅ this is also important!
      uniqueToken: user.uniqueToken,
      department: user.department,
      idNumber:user.idNumber,
      program:user.program,
      expectedYearToGraduate:user. expectedYearToGraduate,
      
     })
  
  } catch (error) {
    console.log("Error", error)
    res.status(500).json({message:"Internal server error"})
  }
}

export const logout = (req,res)=>{
  try {
    res.cookie("jwt", "",{maxAge:0} )
    res.status(200).json({message:"Logged out successfully"})
  } catch (error) {
    console.log("Error", error)
    res.status(500).json({messae:"Internal server error"})
    
  }
}

export const checkUser = async (req,res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("error in checkauth controller", error.message)
    res.status(500).json({message:"internal server error"})
  }
}