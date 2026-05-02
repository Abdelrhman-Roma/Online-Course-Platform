document.addEventListener("DOMContentLoaded", () => {
    const readJsonStorage = (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    };

    const getProfileHref = () => {
        const isPagesPath = window.location.pathname.includes("/pages/");
        return isPagesPath ? "omar-profile.html" : "pages/omar-profile.html";
    };

    const updateAuthButtons = () => {
        const authButtons = document.querySelector(".auth-buttons");

        if (!authButtons) {
            return;
        }

        const currentUser = readJsonStorage("eduverseCurrentUser");
        const profile = readJsonStorage("eduverseProfile");
        const registeredUser = readJsonStorage("eduverseRegisteredUser");
        const displayName =
            profile?.fullName ||
            registeredUser?.fullName ||
            currentUser?.username ||
            currentUser?.email;

        if (!currentUser && !profile) {
            return;
        }

        authButtons.innerHTML = `<a href="${getProfileHref()}" class="btn primary">${displayName || "My Profile"}</a>`;
    };

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    const faqQuestions = document.querySelectorAll(".faq-item > .question");

    faqQuestions.forEach((question) => {
        const item = question.closest(".faq-item");
        const answer = item.querySelector(".answer");

        if (!answer) {
            return;
        }

        answer.style.display = "none";

        item.addEventListener("click", (event) => {
            event.stopPropagation();

            const isActive = item.classList.contains("active");

            faqQuestions.forEach((otherQuestion) => {
                const otherItem = otherQuestion.closest(".faq-item");
                const otherAnswer = otherItem.querySelector(".answer");

                if (otherItem && otherAnswer) {
                    otherItem.classList.remove("active");
                    otherAnswer.style.display = "none";
                }
            });

            item.classList.toggle("active", !isActive);
            answer.style.display = isActive ? "none" : "block";
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

        themeButton.setAttribute("aria-pressed", String(isDark));
        themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

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

            const selectedTheme = document.body.classList.contains("dark") ? "dark" : "light";
            localStorage.setItem("theme", selectedTheme);
            updateThemeButton();
        });
    }

    updateAuthButtons();
});
