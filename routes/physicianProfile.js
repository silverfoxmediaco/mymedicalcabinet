const express = require("express");
const router = express.Router();
const PhysicianProfile = require("../models/PhysicianProfile");

// POST: Create or update a physician profile
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      fullName,
      contactEmail,
      mobilePhone,
      officePhone,
      officeAddress,
      licenseNumber,
      licenseExpiration,
      hospital,
      medicalSchool,
      boardCertifications,
      specialty,
      yearsInPractice,
      accolades,
      penalties
    } = req.body;

    const existingProfile = await PhysicianProfile.findOne({ userId });

    if (existingProfile) {
      await PhysicianProfile.updateOne({ userId }, req.body);
      return res.status(200).json({ message: "Physician profile updated." });
    } else {
      const newProfile = new PhysicianProfile({
        userId,
        fullName,
        contactEmail,
        mobilePhone,
        officePhone,
        officeAddress,
        licenseNumber,
        licenseExpiration,
        hospital,
        medicalSchool,
        boardCertifications,
        specialty,
        yearsInPractice,
        accolades,
        penalties
      });
      await newProfile.save();
      return res.status(201).json({ message: "Physician profile created." });
    }
  } catch (err) {
    console.error("Error saving physician profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Fetch profile by user ID
router.get("/:userId", async (req, res) => {
  try {
    const profile = await PhysicianProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

