import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  user: 
  { 
    type: String, 
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  timestamp: 
  { 
    type: Date, 
    default: Date.now 
  },
  details: 
  { 
    type: Object, 
    default: {} 
  },
  userRole:{
    type: String,
    required: false
  }
});

export const AuditLogs = mongoose.model("AuditLogs", AuditLogSchema);