import mongoose from "mongoose"
import User from "../models/user.model.js"
import { generateKeyPair } from "../lib/generateKeys.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"

export const signup = async(req,res) =>{
  const{fullName, email, password, role, idNumber} = req.body

  try {
    const existingUser = await User.findOne({email})
    
    if(existingUser){return res.status(400).json({message:"user already exist"})}
    
    
    if(role === "student" & !idNumber){return res.status(400).json({message:"Id number is required"})}

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
        privateKey 
      });

    if(newUser){
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id:newUser._id,
        fullName, 
        email, 
        password:hashedPassword, 
        role, 
        idNumber, 
        publicKey, 
        privateKey 
      });
      
    } else {
      return res.status(400).json({message:"Invalid user data"})
    }
  } catch (error) {
    console.log("the error", error.message)
    res.status(500).json({message:"server error"})
  }
}

export const login = (req,res) =>{
  res.send("tae")
}

export const logout = (req,res) =>{
  res.send("tae")
}