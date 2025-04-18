const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");

if (!userId) {
  console.error("No userId in query string");
} else {
  fetch(`/api/physician-profile/${userId}`)
    .then(res => res.json())
    .then(profile => {
      document.getElementById("doctor-name").textContent = profile.fullName;
      document.getElementById("doctor-specialty").textContent = profile.specialty;
      document.getElementById("doctor-hospital").textContent = profile.hospital;
      document.getElementById("doctor-license").textContent = profile.licenseNumber;
      document.getElementById("doctor-expiration").textContent = profile.licenseExpiration;
      document.getElementById("doctor-school").textContent = profile.medicalSchool;
      document.getElementById("doctor-certifications").innerHTML = profile.boardCertifications.map(cert => `<li>${cert}</li>`).join("");
      document.getElementById("doctor-years").textContent = profile.yearsInPractice;
      document.getElementById("doctor-awards").innerHTML = profile.accolades.map(a => `<li>${a}</li>`).join("");
      document.getElementById("doctor-penalties").innerHTML = profile.penalties.map(p => `<li>${p}</li>`).join("");
      document.getElementById("doctor-email").textContent = profile.contactEmail;
      document.getElementById("doctor-mobile").textContent = profile.mobilePhone;
      document.getElementById("doctor-office-phone").textContent = profile.officePhone;
      document.getElementById("doctor-office-address").textContent = profile.officeAddress;
      document.getElementById("profile-pic").src = profile.profileImage || "doctorimage1.jpeg";


      // Social links
      if (profile.social) {
        if (profile.social.linkedin)
          document.getElementById("social-linkedin").href = profile.social.linkedin;
        if (profile.social.x)
          document.getElementById("social-x").href = profile.social.x;
        if (profile.social.instagram)
          document.getElementById("social-instagram").href = profile.social.instagram;
      }
    })
    .catch(err => {
      console.error("Failed to load doctor profile:", err);
    });
}

// Open modal and populate with existing data
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  const editIcon = document.getElementById("edit-profile-icon");

  if (editIcon && userId) {
    editIcon.addEventListener("click", async () => {
      try {
        const res = await fetch(`/api/physician-profile/${userId}`);
        const profile = await res.json();

        document.getElementById("edit-fullName").value = profile.fullName || "";
        document.getElementById("edit-contactEmail").value = profile.contactEmail || "";
        document.getElementById("edit-mobilePhone").value = profile.mobilePhone || "";
        document.getElementById("edit-officePhone").value = profile.officePhone || "";
        document.getElementById("edit-officeAddress").value = profile.officeAddress || "";
        document.getElementById("edit-licenseNumber").value = profile.licenseNumber || "";
        document.getElementById("edit-licenseExpiration").value = profile.licenseExpiration?.substring(0,10) || "";
        document.getElementById("edit-hospital").value = profile.hospital || "";
        document.getElementById("edit-medicalSchool").value = profile.medicalSchool || "";
        document.getElementById("edit-specialty").value = profile.specialty || "";
        document.getElementById("edit-yearsInPractice").value = profile.yearsInPractice || "";
        document.getElementById("edit-boardCertifications").value = profile.boardCertifications?.join(", ") || "";
        document.getElementById("edit-accolades").value = profile.accolades?.join(", ") || "";
        document.getElementById("edit-penalties").value = profile.penalties?.join(", ") || "";

        document.getElementById("edit-physician-profile-modal").classList.remove("hidden");
      } catch (err) {
        console.error("Could not load physician profile:", err);
        alert("Failed to load profile.");
      }
    });
  }

  const closeBtn = document.getElementById("close-edit-physician-profile-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("edit-physician-profile-modal").classList.add("hidden");
    });
  }
});


// Close modal
const closeBtn = document.getElementById("close-edit-physician-profile-modal");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    document.getElementById("edit-physician-profile-modal").classList.add("hidden");
  });
}

// Submit updated profile
const form = document.getElementById("edit-physician-profile-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedProfile = {
      userId: userId, // replace with actual user ID context
      fullName: document.getElementById("edit-fullName").value,
      contactEmail: document.getElementById("edit-contactEmail").value,
      mobilePhone: document.getElementById("edit-mobilePhone").value,
      officePhone: document.getElementById("edit-officePhone").value,
      officeAddress: document.getElementById("edit-officeAddress").value,
      licenseNumber: document.getElementById("edit-licenseNumber").value,
      licenseExpiration: document.getElementById("edit-licenseExpiration").value,
      hospital: document.getElementById("edit-hospital").value,
      medicalSchool: document.getElementById("edit-medicalSchool").value,
      specialty: document.getElementById("edit-specialty").value,
      yearsInPractice: parseInt(document.getElementById("edit-yearsInPractice").value) || 0,
      boardCertifications: document.getElementById("edit-boardCertifications").value.split(",").map(s => s.trim()),
      accolades: document.getElementById("edit-accolades").value.split(",").map(s => s.trim()),
      penalties: document.getElementById("edit-penalties").value.split(",").map(s => s.trim())
    };

    try {
      const res = await fetch("/api/physician-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });

      if (res.ok) {
        alert("Profile saved successfully!");
        document.getElementById("edit-physician-profile-modal").classList.add("hidden");
        location.reload();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to save profile");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving.");
    }
  });

  document.getElementById("edit-profile-icon")?.addEventListener("click", () => {
    
  });

}

// Open edit profile modal
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

// Close profile modal on X click
document.getElementById("close-edit-modal").addEventListener("click", () => {
  document.getElementById("edit-profile-modal").classList.add("hidden");
});

// Save changes to profile
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
      location.reload(); // Or manually update DOM fields
    } else {
      const err = await res.json();
      alert(err.message || "Failed to update profile.");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    alert("Something went wrong while saving.");
  }
});

// Load and Display User Profile Data (Edit Modal + Dashboard)
async function loadUserProfile() {
  try {
    const res = await fetch("https://mymedicalcabinet.onrender.com/api/profile");
    if (!res.ok) throw new Error("Failed to load profile");
    const user = await res.json();

    // Populate Edit Modal Fields
    document.getElementById("edit-profile-name").value = user.name || "";
    document.getElementById("edit-profile-email").value = user.email || "";
    document.getElementById("edit-profile-phone").value = user.phone || "";
    document.getElementById("edit-profile-address").value = user.address || "";
    document.getElementById("edit-profile-age").value = user.age || "";
    document.getElementById("edit-profile-height").value = user.height || "";
    document.getElementById("edit-profile-weight").value = user.weight || "";
    document.getElementById("edit-profile-emergency-contact").value = user.emergencyContact || "";
    document.getElementById("edit-profile-emergency-phone").value = user.emergencyPhone || "";

    // Update Dashboard Profile View
    document.getElementById("profile-name").textContent = user.name || "N/A";
    document.getElementById("profile-email").textContent = user.email || "N/A";
    document.getElementById("profile-phone").textContent = user.phone || "N/A";
    document.getElementById("profile-address").textContent = user.address || "N/A";
    document.getElementById("profile-emergency-contact-name").textContent = user.emergencyContact || "N/A";
    document.getElementById("profile-emergency-phone").textContent = user.emergencyPhone || "N/A";
    document.getElementById("profile-age").textContent = user.age || "N/A";
    document.getElementById("profile-height").textContent = user.height || "N/A";
    document.getElementById("profile-weight").textContent = user.weight || "N/A";
  } catch (err) {
    console.error("Could not load profile:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadUserProfile);
// Add event listener to the "Edit" button
