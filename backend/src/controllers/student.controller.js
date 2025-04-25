import mongoose from "mongoose";
import User from "../models/user.model.js";
import StudentRequest from "../models/student.request.model.js";
import cloudinary from "../lib/cloudinary.js";

export const requestDiploma = async (req, res) => {
  try {
    const { _id: studentId } = req.user;
    const { reason, paymentReceiptBase64, affidavitOfLossBase64 } = req.body;

    // 1. Validate required fields
    if (!reason || !paymentReceiptBase64 || !affidavitOfLossBase64) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Verify user exists and profile is complete
    const user = await User.findById(studentId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.fullName || !user.idNumber || !user.email) {
      return res.status(400).json({
        message: "Complete your profile first",
      });
    }

    // 3. Check approved requests limit
    const approvedCount = await StudentRequest.countDocuments({
      student: studentId,
      status: "accepted",
    });
    if (approvedCount >= 3) {
      return res.status(400).json({
        message: "Maximum limit reached (3 approved requests)",
      });
    }

    // Helper function to upload with proper Base64 handling
    const uploadToCloudinary = async (base64Data, folderName) => {
      // Check if it's already a properly formatted Base64 string
      if (base64Data.startsWith('data:')) {
        return cloudinary.uploader.upload(base64Data, {
          folder: `diploma_requests/${folderName}`,
          resource_type: 'auto' // Let Cloudinary detect the type
        });
      }
      
      // If it's raw Base64 without prefix, assume it's a PDF
      const formattedBase64 = `data:application/pdf;base64,${base64Data}`;
      return cloudinary.uploader.upload(formattedBase64, {
        folder: `diploma_requests/${folderName}`,
        resource_type: 'auto'
      });
    };

    // 4. Upload files
    const [paymentReceiptResult, affidavitResult] = await Promise.all([
      uploadToCloudinary(paymentReceiptBase64, 'payments'),
      uploadToCloudinary(affidavitOfLossBase64, 'affidavits')
    ]);

    // 5. Create request
    const newRequest = await StudentRequest.create({
      student: studentId,
      reason,
      paymentReceipt: paymentReceiptResult.secure_url,
      affidavitOfLoss: affidavitResult.secure_url,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: newRequest,
    });

  } catch (error) {
    console.error("Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing your request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await StudentRequest.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v"); // Exclude version key

    if (!requests.length) {
      return res.status(200).json({
        success: true,
        message: "No requests found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error("Get Requests Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests"
    });
  }
};