import mongoose from "mongoose"
import User from "../models/user.model.js"
import { generateKeyPair } from "../lib/generateKeys.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';  // Add this at the top of your file
import nodemailer from 'nodemailer'; // Add this at the top of your file
import dotenv from 'dotenv'; // Add this at the top of your file
dotenv.config(); // Load environment variables

export const signup = async(req,res) =>{
  const{fullName, email, password, role, idNumber,department, program, expectedYearToGraduate, dateOfBirth} = req.body

  try {
    const existingUser = await User.findOne({email})
    
    if(existingUser){return res.status(400).json({message:"user already exist"})}
    
    
    if(role === "student" & !idNumber){
      return res.status(400).json({message:"Id number is required"})
    }

    let sToken = null;
    let GWA = null; 

    if(role === "student"){
      sToken = uuidv4();
      GWA = (Math.random() * (3 - 1) + 1).toFixed(2);
    }

    let publicKey = null;
    let privateKey = null;

    if(role === "dean" || role === "registrar" ){
      ({ publicKey, privateKey } = generateKeyPair());
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName, 
      email, 
      password: hashedPassword, 
      role, 
      idNumber, 
      publicKey, 
      privateKey,
      uniqueToken: sToken,
      department,
      program,
      expectedYearToGraduate,
      dateOfBirth,
      GWA: GWA 
    });

    if(newUser){
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName, 
        email, 
        role: newUser.role, 
        uniqueToken: sToken,
        department,
        program,
        expectedYearToGraduate,
        idNumber: newUser.idNumber,
        dateOfBirth,
        GWA: GWA
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // 3️⃣ Send the reset token to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS   // Your Gmail password or App Password
      }
    });

const resetLink = `localhost:5173/reset-password?token=${resetToken}`;

const mailOptions = {
  from: `"Your App Name" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Password Reset Request',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      
      <a href="${resetLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
                color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
        Reset Password
      </a>

      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetLink}</p>

      <p style="color: #888; font-size: 0.9em;">
        <em>This link will expire in 1 hour. If you didn't request this, please ignore this email.</em>
      </p>
    </div>
  `
};

    await transporter.sendMail(mailOptions);

    // 4️⃣ Respond back to the frontend
    res.status(200).json({ message: "Reset token sent to your email" });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPasswordatLoggedIn = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new password are required" });
  }

  try {
    // 1. Find user
    const user = await User.findById(req.user._id).select('+password'); // Explicitly include password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify current password
    if (!user.password) {
      return res.status(400).json({ message: "Password not set for this user" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 3. Validate new password
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // 4. Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 5. Respond with success (omit password in response)
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ 
      message: "Password updated successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body; 
  
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2. Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}