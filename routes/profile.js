const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/profile
router.get("/", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await User.findById(userId).select("-password -verificationToken");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile
router.put("/", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { name, phone, address, age, height, weight, emergencyContact, emergencyPhone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address, age, height, weight, emergencyContact, emergencyPhone },
      { new: true }
    ).select("-password -verificationToken");

    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
