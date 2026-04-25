document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");


    if (toggle) {
        toggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
});