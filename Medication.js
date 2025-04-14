const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  pharmacy: { type: String },
  notes: { type: String },
  info: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Medication", medicationSchema);
