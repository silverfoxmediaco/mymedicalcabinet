const mongoose = require("mongoose");

const physicianProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Contact Info
  fullName: String,
  contactEmail: String,
  mobilePhone: String,
  officePhone: String,
  officeAddress: String,
  
  // Credentials
  licenseNumber: String,
  licenseExpiration: Date,
  hospital: String,
  medicalSchool: String,
  boardCertifications: [String],
  specialty: String,
  yearsInPractice: Number,

  // Reputation
  accolades: [String],
  penalties: [String],
  starRating: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("PhysicianProfile", physicianProfileSchema);
