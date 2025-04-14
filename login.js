// public / login.js

document.getElementById("login-form").addEventListener("submit", async (e) => {e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("login-error");

    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password})
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = "/mydashboard.html";
        } else {
            errorMsg.textContent = data.message || "Login failed.";
        }
    } catch (err) {
        console.error("Login error:", err);
        errorMsg.textContent = "Something went wrong, check password and username.";
    }
})