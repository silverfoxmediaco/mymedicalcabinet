// RENDER FUNCTIONS

const username = "James";
document.querySelector(".welcome-h2").innerHTML = `Welcome, ${username}`;

const API_BASE = "http://localhost:3000";

function renderMedication(med) {
  const list = document.getElementById("medications-list");
  const li = document.createElement("li");
  li.dataset.id = med._id;
  li.innerHTML = `
    <strong class="med-name-click" style="cursor:pointer">${med.name}</strong> (${med.dosage}) - ${med.frequency}<br>
    <small>Pharmacy: ${med.pharmacy || "N/A"}<br>${new Date(med.createdAt).toLocaleDateString()} — ${med.notes}</small><br>
    <button class="edit-med" data-id="${med._id}" aria-label="Edit">
      <img src="edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="Edit" width="20" height="20" />
    </button>
    
`;
  list.appendChild(li);
  li.querySelector(".med-name-click").addEventListener("click", () => openMedModal(med));
}

function renderPhysician(doc) {
  const list = document.getElementById("physicians-list");
  const li = document.createElement("li");
  li.dataset.id = doc._id;
  li.innerHTML = `
    <strong>${doc.name}</strong> 
    (${doc.specialty}) - ${doc.phone}<br>
    ${doc.email || "No email"}<br>
    ${doc.address || "No address"}<br>
    <small>${doc.notes}</small><br>

    <button class="edit-physician" data-id="${doc._id}" aria-label="Edit">
      <img src="edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="Edit" width="20" height="20" />
    </button>
`;
  list.appendChild(li);
}

function renderInsurance(doc) {
    const list = document.getElementById("health-insurance");
    const li = document.createElement("li");
    li.dataset.id = doc._id;
    li.innerHTML = `
      <strong>${doc.name}</strong><br> 
      Phone: ${doc.phone || "N/A"}<br>
      Email: ${doc.email || "N/A"}<br>
      Address: ${doc.address || "N/A"}<br>
      ${doc.notes|| ""}<br>
      <button class="edit-insurance" data-id="${doc._id}" aria-label="Edit">
        <img src="edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="Edit" width="20" height="20" />
      </button>
    `;
    list.appendChild(li);
  }

function renderHistory(entry) {
  const list = document.getElementById("history-list");
  const li = document.createElement("li");
  li.dataset.id = entry._id;
  li.innerHTML = `
    <strong>${entry.type}</strong> (${entry.date})<br>
    <small>${entry.description}</small><br>
    <button class="edit-history" data-id="${entry._id}" aria-label="Edit">
      <img src="edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="Edit" width="20" height="20" />
    </button>
`;
  list.appendChild(li);
}

// Delete handlers 

// ==== Delete Handlers ====

document.getElementById("medications-list").addEventListener("click", async (e) => {
    const btn = e.target.closest("#delete-record-btn");
    if (!btn) return;
  
    const id = btn.dataset.id;
    if (confirm("Delete this medication?")) {
      try {
        const res = await fetch(`${API_BASE}/api/medications/${id}`, { method: "DELETE" });
        if (res.ok) location.reload();
        else alert("Failed to delete medication");
      } catch (err) {
        console.error("Error deleting medication:", err);
      }
    }
  });
  
  document.getElementById("physicians-list").addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-physician");
    if (!btn) return;
  
    const id = btn.dataset.id;
    if (confirm("Delete this physician?")) {
      try {
        const res = await fetch(`${API_BASE}/api/physicians/${id}`, { method: "DELETE" });
        if (res.ok) location.reload();
        else alert("Failed to delete physician");
      } catch (err) {
        console.error("Error deleting physician:", err);
      }
    }
  });
  
  document.getElementById("history-list").addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-history");
    if (!btn) return;
  
    const id = btn.dataset.id;
    if (confirm("Delete this health history record?")) {
      try {
        const res = await fetch(`${API_BASE}/api/health-history/${id}`, { method: "DELETE" });
        if (res.ok) location.reload();
        else alert("Failed to delete health history");
      } catch (err) {
        console.error("Error deleting health history:", err);
      }
    }
  });
  
let drugList = [];

async function loadDrugs() {
  try {
    const response = await fetch("/drugs.json");
    drugList = await response.json();
  } catch (err) {
    console.error("Failed to load drugs.json:", err);
    drugList = []; // Fallback if needed
  }
}

// AUTO-LOAD ALL DATA

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const medRes = await fetch(`${API_BASE}/api/medications`);
    const meds = await medRes.json();
    meds.forEach(med => renderMedication(med));

    const docRes = await fetch(`${API_BASE}/api/physicians`);
    const physicians = await docRes.json();
    physicians.forEach(doc => renderPhysician(doc));

    const insuranceRes = await fetch(`${API_BASE}/api/insurance`);
    const insuranceEntries = await insuranceRes.json();
    insuranceEntries.forEach(entry => renderInsurance(entry));

    const historyRes = await fetch(`${API_BASE}/api/health-history`);
    const historyEntries = await historyRes.json();
    historyEntries.forEach(entry => renderHistory(entry));
  } catch (err) {
    console.error("Error loading dashboard data:", err);
  }
});

function openMedModal(med) {
  document.getElementById("modal-med-name").textContent = med.name;
  document.getElementById("modal-dosage").textContent = med.dosage || "N/A";
  document.getElementById("modal-frequency").textContent = med.frequency || "N/A";
  document.getElementById("modal-info").textContent = med.info || "No additional info available.";
  document.getElementById("medication-modal").classList.remove("hidden");
}

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("medication-modal").classList.add("hidden");
});

document.getElementById("medication-modal").addEventListener("click", (e) => {
  if (e.target.id === "medication-modal") {
    document.getElementById("medication-modal").classList.add("hidden");
  }
});

// FORM SUBMISSIONS

// Medications form

document.getElementById("medication-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const editId = form.dataset.editingId;

  const name = document.getElementById("med-name").value;
  const dosage = document.getElementById("med-dosage").value;
  const frequency = document.getElementById("med-frequency").value;
  const pharmacy = document.getElementById("med-pharmacy").value;
  const notes = document.getElementById("med-notes").value;

  const url = editId ? `${API_BASE}/api/medications/${editId}` : `${API_BASE}/api/medications`;
  const method = editId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, dosage, frequency, pharmacy, notes })
    });

    const data = await res.json();

    if (res.ok) {
      location.reload();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Error saving medication:", err);
  }

  form.removeAttribute("data-editing-id");
});

// MEDICATION EDIT HANDLER

//Medications List

document.getElementById("medications-list").addEventListener("click", (e) => {
  const button = e.target.closest(".edit-med");
  if (!button) return;

  const li = button.closest("li");
  const id = li.dataset.id;
  const text = li.innerText;

  const nameText = li.querySelector("strong").textContent;
  const detailText = li.innerText;

  const dosageMatch = detailText.match(/\((.*?)\)/);
  const frequencyMatch = detailText.match(/\)\s-\s(.*?)\n/);
  const pharmacyMatch = detailText.match(/Pharmacy:\s(.*?)\n/);
  const notesMatch = li.querySelector("small").textContent.split("—")[1]?.trim();

  document.getElementById("med-name").value = nameText;
  document.getElementById("med-dosage").value = dosageMatch ? dosageMatch[1] : "";
  document.getElementById("med-frequency").value = frequencyMatch ? frequencyMatch[1] : "";
  document.getElementById("med-pharmacy").value = pharmacyMatch ? pharmacyMatch[1] : "";
  document.getElementById("med-notes").value = notesMatch || "";

  document.getElementById("medication-form").dataset.editingId = id;
});

//physicians edit handler

//Physicians Form

document.getElementById("physician-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const editId = form.dataset.editingId;

  const name = document.getElementById("physician-name").value;
  const specialty = document.getElementById("physician-specialty").value;
  const phone = document.getElementById("physician-phone").value;
  const email = document.getElementById("physician-email")?.value || "";
  const address = document.getElementById("physician-address")?.value || "";
  const notes = document.getElementById("physician-notes").value;

  const url = editId ? `${API_BASE}/api/physicians/${editId}` : `${API_BASE}/api/physicians`;
  const method = editId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, specialty, phone, email, address, notes })
    });

    const data = await res.json();

    if (res.ok) {
      location.reload();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Error saving physician:", err);
  }

  form.removeAttribute("data-editing-id");
});

//health history
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("history-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("history-type").value;
    const description = document.getElementById("history-description").value;
    const date = document.getElementById("history-date").value;

    try {
      const res = await fetch(`${API_BASE}/api/health-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, date }),
      });

      const data = await res.json();

      if (res.ok) {
        renderHistory(data.history);
        form.reset();
      } else {
        alert(data.message || "Failed to save health history.");
      }
    } catch (err) {
      console.error("Error saving health history:", err);
      alert("An error occurred.");
    }
  });
});





// My Health Insurance

document.getElementById("health-insurance-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const editId = form.dataset.editingId;
  
    const name = document.getElementById("insurance-company-name").value;
    const phone = document.getElementById("insurance-company-phone").value;
    const email = document.getElementById("insurance-company-email")?.value || "";
    const address = document.getElementById("insurance-company-address")?.value || "";
    const notes = document.getElementById("insurance-company-notes").value;
  
    const url = editId ? `${API_BASE}/api/insurance/${editId}` : `${API_BASE}/api/insurance`;
    const method = editId ? "PUT" : "POST";
  
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, notes })
      });
  
      console.log("Response status:", res.status);
        const text = await res.text();
    console.log("Raw response:", text);

      const data = await res.json();
  
      if (res.ok) {
        location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error saving Insurance:", err);
    }
  
    form.removeAttribute("data-editing-id");
  });

  // Insurance List
  // Open Insurance edit Modal
  document.getElementById("health-insurance").addEventListener("click", (e) => {
    const button = e.target.closest(".edit-insurance");
    if (!button) return;
  
    const li = button.closest("li");
    const id = li.dataset.id;
    const text = li.innerText;
  
    const name = li.querySelector("strong")?.textContent || "";
    const phone = text.match(/Phone:\s(.*?)\n/)?.[1] || "";
    const email = text.match(/Email:\s(.*?)\n/)?.[1] || "";
    const address = text.match(/Address:\s(.*?)\n/)?.[1] || "";
    const lines = text.split("\n");
    const notes = lines[lines.length - 2] || ""; // crude fallback
  
    document.getElementById("edit-insurance-company-name").value = name;
    document.getElementById("edit-insurance-company-phone").value = phone;
    document.getElementById("edit-insurance-company-email").value = email;
    document.getElementById("edit-insurance-company-address").value = address;
    document.getElementById("edit-insurance-company-notes").value = notes;
    document.getElementById("edit-health-insurance-form").dataset.editingId = id;
  
    document.getElementById("edit-insurance-modal").classList.remove("hidden");
  });
  
  //insurance submit handler
  document.getElementById("edit-health-insurance-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const editId = e.target.dataset.editingId;
    const name = document.getElementById("edit-insurance-company-name").value;
    const phone = document.getElementById("edit-insurance-company-phone").value;
    const email = document.getElementById("edit-insurance-company-email").value;
    const address = document.getElementById("edit-insurance-company-address").value;
    const notes = document.getElementById("edit-insurance-company-notes").value;
  
    try {
      const res = await fetch(`${API_BASE}/api/insurance/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, notes })
      });
  
      if (res.ok) {
        alert("Insurance info updated!");
        location.reload();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update insurance info.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating insurance info.");
    }
  });
  
  
  // Close modal
  document.getElementById("close-edit-insurance-modal").addEventListener("click", () => {
    document.getElementById("edit-insurance-modal").classList.add("hidden");
  });
  
  // Delete Insurance

  document.getElementById("delete-insurance-btn").addEventListener("click", async () => {
    const editId = document.getElementById("edit-health-insurance-form").dataset.editingId;
    if (!editId) return;
  
    if (confirm("Are you sure you want to delete this insurance info?")) {
      try {
        const res = await fetch(`${API_BASE}/api/insurance/${editId}`, {
          method: "DELETE"
        });
  
        if (res.ok) {
          alert("Insurance Info deleted.");
          location.reload();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete insurance info.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while trying to delete your insurnace info.");
      }
    }
  });


// Physicians List

// Open physician edit modal
document.getElementById("physicians-list").addEventListener("click", (e) => {
    const button = e.target.closest(".edit-physician");
    if (!button) return;
  
    const li = button.closest("li");
    const id = li.dataset.id;
    const text = li.innerText;
  
    const nameText = li.querySelector("strong").textContent;
    const specialty = li.innerText.match(/\((.*?)\)/)?.[1] || "";
    const phone = li.innerText.match(/\)\s-\s(.*?)\n/)?.[1] || "";
    const notes = li.querySelector("small")?.textContent || "";
  
    document.getElementById("edit-physician-name").value = nameText;
    document.getElementById("edit-physician-specialty").value = specialty;
    document.getElementById("edit-physician-phone").value = phone;
    document.getElementById("edit-physician-email").value = text.match(/@.*?(\n|$)/)?.[0]?.trim() || "";
    document.getElementById("edit-physician-address").value = text.split("\n")[2]?.trim() || "";
    document.getElementById("edit-physician-notes").value = notes;
    document.getElementById("edit-physician-form").dataset.editingId = id;
    document.getElementById("edit-physician-modal").classList.remove("hidden");
  });
  
  // Close modal
  document.getElementById("close-edit-physician-modal").addEventListener("click", () => {
    document.getElementById("edit-physician-modal").classList.add("hidden");
  });
  
  // Delete physician

  document.getElementById("delete-physician-btn").addEventListener("click", async () => {
    const editId = document.getElementById("edit-physician-form").dataset.editingId;
    if (!editId) return;
  
    if (confirm("Are you sure you want to delete this physician?")) {
      try {
        const res = await fetch(`${API_BASE}/api/physicians/${editId}`, {
          method: "DELETE"
        });
  
        if (res.ok) {
          alert("Physician deleted.");
          location.reload();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete physician.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while trying to delete the physician.");
      }
    }
  });
  
  

// History Edit Handler
// History List

// Open history edit modal
document.getElementById("history-list").addEventListener("click", (e) => {
    const button = e.target.closest(".edit-history");
    if (!button) return;
  
    const li = button.closest("li");
    const id = li.dataset.id;
  
    const type = li.querySelector("strong").textContent;
    const date = li.innerHTML.match(/\((.*?)\)<br>/)?.[1] || "";
    const description = li.querySelector("small")?.textContent || "";
  
    document.getElementById("edit-history-type").value = type;
    document.getElementById("edit-history-date").value = date;
    document.getElementById("edit-history-description").value = description;
  
    document.getElementById("edit-history-form").dataset.editingId = id;
    document.getElementById("edit-history-modal").classList.remove("hidden");
  });
  
  // Close modal
  document.getElementById("close-edit-history-modal").addEventListener("click", () => {
    document.getElementById("edit-history-modal").classList.add("hidden");
  });
  
  // Delete history entry
  
  document.getElementById("delete-history-btn").addEventListener("click", async () => {
    const editId = document.getElementById("edit-history-form").dataset.editingId;
    if (!editId) return;
  
    if (confirm("Are you sure you want to delete this history entry?")) {
      try {
        const res = await fetch(`${API_BASE}/api/health-history/${editId}`, {
          method: "DELETE"
        });
  
        if (res.ok) {
          alert("History entry deleted.");
          location.reload();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete history entry.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while trying to delete the history entry.");
      }
    }
  });
  
//Open edit profile modal
document.querySelector(".edit-profile-btn").addEventListener("click", async () => {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) throw new Error("Failed to load profile");

    const user = await res.json();

    document.getElementById("edit-profile-name").value = user.name || "";
    document.getElementById("edit-profile-email").value = user.email || "";
    document.getElementById("edit-profile-phone").value = user.phone || "";
    document.getElementById("edit-profile-address").value = user.address || "";
    document.getElementById("edit-profile-age").value = user.age || "";
    document.getElementById("edit-profile-height").value = user.height || "";
    document.getElementById("edit-profile-weight").value = user.weight || "";
    document.getElementById("edit-profile-emergency-contact").value = user.emergencyContact || "";
    document.getElementById("edit-profile-emergency-phone").value = user.emergencyPhone || "";

    document.getElementById("edit-profile-modal").classList.remove("hidden");
  } catch (err) {
    alert("Could not load profile data.");
    console.error(err);
  }
});

//close profile modal on X
document.getElementById("close-edit-modal").addEventListener("click", () => {
  document.getElementById("edit-profile-modal").classList.add("hidden");
});

//save changes to profile modal
document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProfile = {
    name: document.getElementById("edit-profile-name").value,
    email: document.getElementById("edit-profile-email").value,
    phone: document.getElementById("edit-profile-phone").value,
    address: document.getElementById("edit-profile-address").value,
    age: document.getElementById("edit-profile-age").value,
    height: document.getElementById("edit-profile-height").value,
    weight: document.getElementById("edit-profile-weight").value,
    emergencyContact: document.getElementById("edit-profile-emergency-contact").value,
    emergencyPhone: document.getElementById("edit-profile-emergency-phone").value
  };

  try {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile)
    });

    if (res.ok) {
      alert("Profile updated successfully!");
      document.getElementById("edit-profile-modal").classList.add("hidden");
      location.reload(); // Or re-render profile section manually
    } else {
      const err = await res.json();
      alert(err.message || "Failed to update profile.");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    alert("Something went wrong while saving.");
  }
});


// Edit info Modal
// Open edit modal
document.getElementById("medications-list").addEventListener("click", (e) => {
    const button = e.target.closest(".edit-med");
    if (!button) return;
  
    const li = button.closest("li");
    const id = li.dataset.id;
    const text = li.innerText;

  
    document.getElementById("edit-medication-form").dataset.editingId = id;
    document.getElementById("edit-med-name").value = li.querySelector("strong").textContent;
  
    
    document.getElementById("edit-med-dosage").value = text.match(/\((.*?)\)/)?.[1] || "";
    document.getElementById("edit-med-frequency").value = text.match(/\)\s-\s(.*?)\n/)?.[1] || "";
    document.getElementById("edit-med-pharmacy").value = text.match(/Pharmacy:\s(.*?)\n/)?.[1] || "";
    document.getElementById("edit-med-notes").value = li.querySelector("small").textContent.split("—")[1]?.trim() || "";
  
    document.getElementById("edit-medication-modal").classList.remove("hidden");
  });

  document.getElementById("delete-record-btn").addEventListener("click", async () => {
  const editId = document.getElementById("edit-medication-form").dataset.editingId;
  if (!editId) return;

  if (confirm("Are you sure you want to delete this record?")) {
    try {
      const res = await fetch(`${API_BASE}/api/medications/${editId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Record deleted.");
        location.reload();
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }
});

  
  // Close modal (X or outside)
  document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.getElementById("edit-medication-modal").classList.add("hidden");
  });
  document.getElementById("edit-medication-modal").addEventListener("click", (e) => {
    if (e.target.id === "edit-medication-modal") {
      document.getElementById("edit-medication-modal").classList.add("hidden");
    }
  });

  // Modal Submit logic

  document.getElementById("edit-medication-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const editId = form.dataset.editingId;
  
    const name = document.getElementById("edit-med-name").value;
    const dosage = document.getElementById("edit-med-dosage").value;
    const frequency = document.getElementById("edit-med-frequency").value;
    const pharmacy = document.getElementById("edit-med-pharmacy").value;
    const notes = document.getElementById("edit-med-notes").value;
  
    try {
      const res = await fetch(`${API_BASE}/api/medications/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dosage, frequency, pharmacy, notes }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error updating medication:", err);
    }
  
    document.getElementById("edit-medication-modal").classList.add("hidden");
  });

  // ====== SAFE DELETE BUTTON HANDLER ======
const deleteMedicationBtn = document.getElementById("delete-medication-btn");

if (deleteMedicationBtn) {
  deleteMedicationBtn.addEventListener("click", async () => {
    const editId = document.getElementById("edit-medication-form")?.dataset.editingId;
    if (!editId) return;

    if (confirm("Are you sure you want to delete this medication?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/medications/${editId}`, {
          method: "DELETE"
        });

        if (res.ok) {
          alert("Medication deleted.");
          location.reload();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete medication.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while trying to delete the medication.");
      }
    }
  });
}

// MODAL CLOSE LISTENERS

// Medication modal (click X or backdrop)
document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.getElementById("edit-medication-modal").classList.add("hidden");
  });
  document.getElementById("edit-medication-modal").addEventListener("click", (e) => {
    if (e.target.id === "edit-medication-modal") {
      document.getElementById("edit-medication-modal").classList.add("hidden");
    }
  });
  
  // Physician modal (click X or backdrop)
  document.getElementById("close-edit-physician-modal").addEventListener("click", () => {
    document.getElementById("edit-physician-modal").classList.add("hidden");
  });
  document.getElementById("edit-physician-modal").addEventListener("click", (e) => {
    if (e.target.id === "edit-physician-modal") {
      document.getElementById("edit-physician-modal").classList.add("hidden");
    }
  });
  
  // History modal (click X or backdrop)
  document.getElementById("close-edit-history-modal").addEventListener("click", () => {
    document.getElementById("edit-history-modal").classList.add("hidden");
  });
  document.getElementById("edit-history-modal").addEventListener("click", (e) => {
    if (e.target.id === "edit-history-modal") {
      document.getElementById("edit-history-modal").classList.add("hidden");
    }
  });

  window.addEventListener("DOMContentLoaded", async () => {
    try {
      // Fetch profile data
      const profileRes = await fetch(`${API_BASE}/api/profile`);
      const user = await profileRes.json();
  
      // Update DOM with user data
      document.getElementById("full-name").textContent = user.name || "";
      document.getElementById("email").textContent = user.email || "";
      document.getElementById("phone").textContent = user.phone || "";
      document.getElementById("address").textContent = user.address || "";
      document.getElementById("emergency-contact").textContent = user.emergencyContact || "";
      document.getElementById("emergency-phone").textContent = user.emergencyPhone || "";
      document.getElementById("age").textContent = user.age || "";
      document.getElementById("height").textContent = user.height || "";
      document.getElementById("weight").textContent = user.weight || "";
    } catch (err) {
      console.error("Failed to load profile data:", err);
    }
  });
  
  
  // DRUG AUTOCOMPLETE LOGIC

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/drugs.json");
    drugList = await response.json();
  } catch (err) {
    console.error("Failed to load drug list:", err);
  }

  const input = document.getElementById("med-name");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const suggestions = drugList
      .filter(drug => drug.toLowerCase().includes(query))
      .slice(0, 5);

    showAutocompleteSuggestions(input, suggestions);
  });
});

function showAutocompleteSuggestions(input, suggestions) {
  let list = document.getElementById("autocomplete-list");
  if (!list) {
    list = document.createElement("ul");
    list.id = "autocomplete-list";
    list.style.position = "absolute";
    list.style.background = "#fff";
    list.style.listStyle = "none"
    list.style.border = "1px solid #ccc";
    list.style.zIndex = "9999";
    list.style.marginTop = "35px"
    input.parentNode.appendChild(list);
  }

  list.innerHTML = "";
  suggestions.forEach(s => {
    const item = document.createElement("li");
    item.textContent = s;
    item.style.padding = "5px";
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      input.value = s;
      list.innerHTML = "";
    });
    list.appendChild(item);
  });
}

// AUTOCOMPLETE: Medication Name
async function loadDrugs() {
  try {
    const response = await fetch("/drugs.json"); 
    drugList = await response.json();
  } catch (err) {
    console.error("Failed to load drugs.json:", err);
  }
}

function setupAutocomplete() {
  const input = document.getElementById("med-name");
  const suggestionBox = document.getElementById("med-suggestions");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    suggestionBox.innerHTML = "";

    if (query.length < 2) return;

    const matches = drugList.filter(drug => drug.toLowerCase().includes(query)).slice(0, 5);

    matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = match;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        input.value = match;
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(li);
    });
  });

  document.addEventListener("click", (e) => {
    if (!suggestionBox.contains(e.target) && e.target !== input) {
      suggestionBox.innerHTML = "";
    }
  });
}

// Load drug names and initialize autocomplete
loadDrugs().then(setupAutocomplete);

// ===== PHONE NUMBER FORMATTING =====
/*
function formatPhoneInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
  
    input.addEventListener("input", function (e) {
      let digits = e.target.value.replace(/\D/g, "");
      if (digits.length > 10) digits = digits.slice(0, 10);
  
      let formatted = digits;
      if (digits.length > 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        formatted = `(${digits}`;
      }
  
      e.target.value = formatted;
    });
  }
  
  // Apply formatting to both fields
  window.addEventListener("DOMContentLoaded", () => {
    formatPhoneInput("physician-phone");
    formatPhoneInput("edit-physician-phone");
  });*/
  

  
  