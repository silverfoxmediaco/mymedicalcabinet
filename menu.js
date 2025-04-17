// Show the sidebar menu
function showSideBar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.style.display = "flex";
}

// Hide the sidebar menu
function hideSideBar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  // Sidebar menu logic
  const burgerBtn = document.querySelector(".burger-menu-btn");
  const closeBtn = document.querySelector(".sidebar-close-btn");

  if (burgerBtn) {
    burgerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSideBar();
    });
  } else {
    console.warn("Burger button not found.");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hideSideBar();
    });
  } else {
    console.warn("Close button not found.");
  }

  // Auth check and logout logic
  try {
    const res = await fetch("/api/profile", { credentials: "include" });

    if (res.ok) {
      const link = document.getElementById("auth-link");
      if (link) {
        link.textContent = "Logout";
        link.href = "#";
        link.classList.add("logout");
        link.addEventListener("click", async (e) => {
          e.preventDefault();
          const logoutRes = await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
          });

          const result = await logoutRes.json();
          if (logoutRes.ok) {
            window.location.href = "login.html";
          } else {
            alert(result.message || "Logout failed.");
          }
        });
      }
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }
});
