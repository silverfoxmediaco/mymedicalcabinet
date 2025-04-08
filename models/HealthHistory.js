const mongoose = require("mongoose");

const healthHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  type: { type: String, required: true },
  description: { type: String },
  date: { type: String }, 
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("HealthHistory", healthHistorySchema);
