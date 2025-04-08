const mongoose = require("mongoose");

const physicianSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  name: { type: String, required: true },
  specialty: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  notes: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Physician", physicianSchema);
