document.addEventListener("DOMContentLoaded", () => {
    const readJsonStorage = (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    };

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    const authButtons = document.querySelector(".auth-buttons");
    const currentUser = readJsonStorage("eduverseCurrentUser");

    
if (authButtons && currentUser) {
        const profile = readJsonStorage("eduverseProfile");
        const registeredUser = readJsonStorage("eduverseRegisteredUser");
        const displayName =
            profile?.fullName ||
            registeredUser?.fullName ||
            currentUser.username ||
            currentUser.email ||
            "My Profile";
        const profileHref = window.location.pathname.includes("/pages/")
            ? "omar-profile.html"
            : "pages/omar-profile.html";

        authButtons.innerHTML = `<a href="${profileHref}" class="btn primary">${displayName}</a>`;
    }
    const faqQuestions = document.querySelectorAll(".faq-item > .question");

    faqQuestions.forEach((question) => {
        const item = question.closest(".faq-item");
        const answer = item.querySelector(".answer");

        if (!answer) {
            return;
        }

        answer.style.display = "none";

        item.addEventListener("click", () => {
            const isOpen = answer.style.display === "block";
            answer.style.display = isOpen ? "none" : "block";
        });
    });

    const themeButton = document.getElementById("theme-toggle");

    const updateThemeButton = () => {
        if (!themeButton) {
            return;
        }

        const isDark = document.body.classList.contains("dark");
        const icon = themeButton.querySelector("i");
        const text = themeButton.querySelector("span");

        if (icon) {
            icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }

        if (text) {
            text.textContent = isDark ? "Light" : "Dark";
        }
    };

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    updateThemeButton();

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
            updateThemeButton();
        });
    }
});
