const express = require("express");
const router = express.Router();
const Insurance = require("../models/Insurance");

// POST /api/insurance
router.post("/", async (req, res) => {
  const { name, phone, email, address, notes } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const insurance = new Insurance({ name, phone, email, address, notes, userId });
    await insurance.save();
    res.status(201).json({ message: "Insurance added!", insurance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving Insurance." });
  }
});

// GET /api/insurance
router.get("/", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const insurance = await Insurance.find({ userId });
    res.json(insurance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching insurance" });
  }
});

// PUT /api/insurance/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address, notes } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const updated = await Insurance.findOneAndUpdate(
      { _id: id, userId }, // 👈 only allow updating if user owns it
      { name, phone, email, address, notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Insurance not found or not yours." });
    }

    res.json({ message: "Insurance updated!", insurance: updated });
  } catch (error) {
    console.error("Error updating insurance:", error);
    res.status(500).json({ message: "Failed to update insurance." });
  }
});

// DELETE /api/insurance/:id
router.delete("/:id", async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const deleted = await Insurance.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Insurance not found or not yours." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete insurance error:", err);
    res.status(500).json({ success: false, message: "Delete failed." });
  }
});

module.exports = router;
