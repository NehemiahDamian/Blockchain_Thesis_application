import mongoose from "mongoose";

const signedDiplomaSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    program: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    expectedYearToGraduate: {
      type: String,
      required: false,
    },
    dateOfGraduation: {
      type: String,
      required: false,
    },
    deanESignature: {
      type: String,
      required: false,
    },
    registrarESignature: {
      type: String,
      required: false,
    },
    signedByDean: {
      type: String,
      required: false,
    },
    deanDigitalSignature: {
      type: String,
      required: false,
    },
    registrarDigitalSignature: {
      type: String,
      required: false,
    },

    uniqueToken: {
      type: String,
      required: false,
    },
    signedAt: {
      type: Date,
      required: false,

    },
  },
  {
    timestamps: true,
  }
);
export const SignedDiploma = mongoose.model("SignedDiploma", signedDiplomaSchema);
