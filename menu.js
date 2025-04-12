//menu js

// Show the sidebar menu
function showSideBar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'flex';
  }
  
  // Hide the sidebar menu
  function hideSideBar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';
  }
  
  document.addEventListener("DOMContentLoaded", () => {
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
  });
  
