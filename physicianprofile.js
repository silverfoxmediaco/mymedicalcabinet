// Assumes the URL includes a userId like: ?userId=abcdef123456
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
      document.getElementById("profile-pic").src = profile.profileImage;

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
