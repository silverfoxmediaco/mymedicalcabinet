document.addEventListener("DOMContentLoaded", function () {

    // Signup form handler
    const signupForm = document.getElementById("signup-form");
    if (!signupForm) return;

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const messageEl = document.getElementById("message");

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, email, password })
            });

            const result = await response.json();
            messageEl.textContent = result.message;

            if (response.ok) {
                window.location.href = "/verify.html";
            }
            

        } catch (error) {
            messageEl.textContent = "Error signing up!";
            console.error(error);
        }
    });
});


