const express = require("express");
const router = express.Router();
const HealthHistory = require("../models/HealthHistory");

// POST /api/health-history
router.post("/", async (req, res) => {
  const { type, description, date } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const history = new HealthHistory({ type, description, date, userId });
    await history.save();
    res.status(201).json({ message: "Health history saved successfully!", history });
  } catch (error) {
    console.error("Error saving health history:", error);
    res.status(500).json({ message: "Error saving health history." });
  }
});

// GET /api/health-history
router.get("/", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const history = await HealthHistory.find({ userId });
    res.json(history);
  } catch (error) {
    console.error("Error fetching health history:", error);
    res.status(500).json({ message: "Error fetching health history." });
  }
});

// PUT /api/health-history/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { type, description, date } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const updated = await HealthHistory.findOneAndUpdate(
      { _id: id, userId },
      { type, description, date },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Health history entry not found or not yours." });
    }

    res.json({ message: "Health history updated!", history: updated });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ message: "Failed to update history." });
  }
});

// DELETE /api/health-history/:id
router.delete("/:id", async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const deleted = await HealthHistory.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Health history entry not found or not yours." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete history error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
