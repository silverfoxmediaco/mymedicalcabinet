const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,

  // 🔽 Additions for dashboard profile
  phone: String,
  address: String,
  age: Number,
  height: String,
  weight: String,
  emergencyContact: String
});

module.exports = mongoose.model("User", userSchema);
