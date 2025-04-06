document.addEventListener("DOMContentLoaded", function () {
    // Select the burger button and the menu
    let burgerBtn = document.querySelector(".burger-menu-btn");
    let burgerMenu = document.querySelector(".burger-menu");

    // Toggle function to show/hide the menu
    function toggleMenu(event) {
        event.preventDefault(); // Prevent touchstart from triggering click too
        burgerMenu.classList.toggle("open");
    }

    // Add event listeners for click and touch
    if (burgerBtn) {
        burgerBtn.addEventListener("click", toggleMenu);
        burgerBtn.addEventListener("touchstart", toggleMenu);
    } else {
        console.error("Burger button not found!");
    }
});