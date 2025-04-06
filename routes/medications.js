const express = require("express");
const router = express.Router();
const Medication = require("../models/Medication");
const axios = require("axios");

// === OpenFDA Info Fetcher ===
async function getMedicationInfo(name) {
  try {
    const res = await axios.get("https://api.fda.gov/drug/label.json", {
      params: {
        search: `openfda.generic_name:"${name}"`,
        limit: 1,
      },
    });

    const result = res.data.results?.[0];
    if (!result) return "No additional info available.";

    const usage =
      result.indications_and_usage?.[0] ||
      result.purpose?.[0] ||
      result.description?.[0] ||
      "No additional info available.";

    const trimmed = usage.split(". ").slice(0, 5).join(". ") + ".";
    return trimmed.length > 500 ? trimmed.slice(0, 500) + "..." : trimmed;
  } catch (err) {
    console.error("OpenFDA error:", err.response?.data || err.message);
    return "No additional info available.";
  }
}

// === POST /api/medications ===
router.post("/", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { name, dosage, frequency, pharmacy, notes } = req.body;

  try {
    const existing = await Medication.findOne({ name });
    const info = existing?.info || await getMedicationInfo(name);

    const medication = new Medication({
      name,
      dosage,
      frequency,
      pharmacy,
      notes,
      info,
      userId,
    });

    await medication.save();
    res.status(201).json({ message: "Medication saved successfully!", medication });
  } catch (error) {
    console.error("Error saving medication:", error);
    res.status(500).json({ message: "Error saving medication." });
  }
});

// === GET /api/medications ===
router.get("/", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const medications = await Medication.find({ userId });
    res.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ message: "Error fetching medications." });
  }
});

// === PUT /api/medications/:id ===
router.put("/:id", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const { name, dosage, frequency, pharmacy, notes, info } = req.body;

  try {
    const updated = await Medication.findOneAndUpdate(
      { _id: id, userId }, // Ensure user owns the medication
      { name, dosage, frequency, pharmacy, notes, info },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Medication not found or not authorized." });
    }

    res.json({ message: "Medication updated!", medication: updated });
  } catch (error) {
    console.error("Error updating medication:", error);
    res.status(500).json({ message: "Failed to update medication." });
  }
});

// === DELETE /api/medications/:id ===
router.delete("/:id", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;

  try {
    const deleted = await Medication.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Medication not found or not authorized." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete medication error:", err);
    res.status(500).json({ success: false, message: "Failed to delete medication." });
  }
});

module.exports = router;
