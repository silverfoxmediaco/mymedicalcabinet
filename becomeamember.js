document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");
  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const messageEl = document.getElementById("message");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password, role })
      });

      const result = await response.json();
      messageEl.textContent = result.message;

      if (response.ok) {
        // 👇 Redirect based on role
        if (role === "physician") {
          window.location.href = "/physician-profile.html";
        } else {
          window.location.href = "/verify.html"; // or dashboard/home/etc.
        }
      }

    } catch (error) {
      messageEl.textContent = "Error signing up. Please try again.";
      console.error("Signup error:", error);
    }
  });
});
