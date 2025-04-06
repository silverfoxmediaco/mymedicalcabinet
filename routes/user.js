const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// POST /api/signup - Register a new user
router.post("/signup", async (req, res) => {
    const { name, username, email, password } = req.body;
  
    try {
      // Optional: Check if user already exists
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "Email already in use." });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ name, username, email, password: hashedPassword });
      await newUser.save();
  
      // Log the user in automatically
      req.session.userId = newUser._id;
  
      res.status(201).json({ message: "Signup successful!" });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Something went wrong. Try again." });
    }
  });
  

// GET /api/profile - Get current user profile
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

// PUT /api/profile - Update current user profile
router.put("/", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { name, phone, address, age, height, weight, emergencyContact } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address, age, height, weight, emergencyContact },
      { new: true }
    ).select("-password -verificationToken");

    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

//sign up route 


module.exports = router;
