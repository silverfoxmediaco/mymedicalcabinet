const express = require("express");
const router = express.Router();
const Physician = require("../models/Physician");

// POST /api/physicians
router.post("/", async (req, res) => {
  const { name, specialty, phone, email, address, notes } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const physician = new Physician({ name, specialty, phone, email, address, notes, userId });
    await physician.save();
    res.status(201).json({ message: "Physician added!", physician });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving physician." });
  }
});

// GET /api/physicians?userId=...
router.get("/", async (req, res) => {
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const physicians = await Physician.find({ userId });
    res.json(physicians);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching physicians." });
  }
});

function renderPhysician(doc) {
    const list = document.getElementById("physicians-list");
  
    const li = document.createElement("li");
    li.dataset.id = doc._id;
    li.innerHTML = `
      <strong>${doc.name}</strong><br>
      Specialty: ${doc.specialty || "N/A"}<br> 
      Phone: ${doc.phone || "N/A"}<br>
      Email: ${doc.email || "N/A"}<br>
      Address: ${doc.address || "N/A"}<br>
      ${doc.notes|| ""}<br>
      <button class="edit-physician" data-id="${doc._id}" aria-label="Edit">
        <img src="edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="Edit" width="20" height="20" />
      </button>
    `;
    list.appendChild(li);
  }
  
  // PUT /api/physicians/:id — Update physician
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, specialty, phone, email, address, notes } = req.body;
    const userId = req.session.userId;
  
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const updated = await Physician.findOneAndUpdate(
        { _id: id, userId }, // 👈 only update if it belongs to the logged-in user
        { name, specialty, phone, email, address, notes },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "Physician not found or not yours." });
      }
  
      res.json({ message: "Physician updated!", physician: updated });
    } catch (error) {
      console.error("Error updating physician:", error);
      res.status(500).json({ message: "Failed to update physician." });
    }
  });
  
  

module.exports = router;

// DELETE /api/physicians/:id — Delete a physician
router.delete("/:id", async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
  
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const deleted = await Physician.findOneAndDelete({ _id: id, userId });
  
      if (!deleted) {
        return res.status(404).json({ message: "Physician not found or not yours." });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error("Delete physician error:", err);
      res.status(500).json({ success: false, message: "Delete failed." });
    }
  });
  
