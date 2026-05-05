const STORAGE_KEYS = {
    // Saved account created from the register page.
    registeredUser: "eduverseRegisteredUser",
    // Active login session.
    currentUser: "eduverseCurrentUser",
    // Editable profile information.
    profile: "eduverseProfile",
    theme: "theme"
};

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.getElementById("theme-toggle");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        // Open or close the hamburger menu on small screens.
        const isActive = navLinks.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isActive));
    });
}

function applyTheme(theme) {
    // The body class lets CSS variables switch the whole page theme.
    const isDark = theme === "dark";

    document.body.classList.toggle("dark", isDark);

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");
        const text = themeToggle.querySelector("span");

        if (icon) {
            icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }

        if (text) {
            text.textContent = isDark ? "Light" : "Dark";
        }

        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }
}

function initializeThemeToggle() {
    // Load the saved theme first, then save any new user choice.
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "light";
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
            localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
            applyTheme(nextTheme);
        });
    }
}

function readStorage(key) {
    // Keep the page working even if saved JSON is damaged.
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        return null;
    }
}

function writeStorage(key, value) {
    // Save objects in one consistent JSON format.
    localStorage.setItem(key, JSON.stringify(value));
}

function updateAuthButtons() {
    // After login, show a profile shortcut instead of Login and Sign Up.
    const authButtons = document.querySelector(".auth-buttons");

    if (!authButtons) {
        return;
    }

    const currentUser = readStorage(STORAGE_KEYS.currentUser);
    const profile = readStorage(STORAGE_KEYS.profile);
    const registeredUser = readStorage(STORAGE_KEYS.registeredUser);
    const displayName =
        profile?.fullName ||
        registeredUser?.fullName ||
        currentUser?.username ||
        currentUser?.email;

    if (!currentUser) {
        return;
    }

    authButtons.innerHTML = `<a href="omar-profile.html" class="btn primary">${displayName || "My Profile"}</a>`;
}

function updateMobileAuthLinks() {
    // Copy the current auth button into the hamburger menu.
    const navLinks = document.querySelector(".nav-links");
    const authButtons = document.querySelector(".auth-buttons");

    if (!navLinks || !authButtons) {
        return;
    }

    const existingMobileAuth = navLinks.querySelector(".mobile-auth-links");

    if (existingMobileAuth) {
        existingMobileAuth.remove();
    }

    const mobileAuthItem = document.createElement("li");
    mobileAuthItem.className = "mobile-auth-links";
    mobileAuthItem.innerHTML = authButtons.innerHTML;
    navLinks.appendChild(mobileAuthItem);
}

function formatTrackLabel(trackValue) {
    // Turn stored track values into readable labels.
    const trackLabels = {
        frontend: "Frontend Development",
        backend: "Backend Development",
        design: "UI/UX Design",
        business: "Business Skills"
    };

    return trackLabels[trackValue] || trackValue || "Frontend Development";
}

function getInitials(name) {
    // Use the first letters of the user's name for the avatar.
    return (name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "OH";
}

function setText(id, value) {
    // Update optional profile text safely.
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function buildProfileFromUser(user) {
    // Create profile data from a registered user, with defaults for missing fields.
    if (!user) {
        return null;
    }

    return {
        fullName: user.fullName || "Omar Habib",
        username: user.username || "omar_habib",
        email: user.email || "omar@example.com",
        phone: user.phone || "",
        track: user.track || "frontend",
        trackLabel: formatTrackLabel(user.track),
        location: user.location || "Cairo, Egypt",
        bio: user.bio || "Passionate about building clean and responsive web interfaces.",
        role: user.role || "student"
    };
}

function getProfileDataFromForm(form) {
    // Read all profile form inputs into a single object.
    const trackSelect = form.querySelector("#profile-track");
    const registeredUser = readStorage(STORAGE_KEYS.registeredUser);

    return {
        fullName: form.querySelector("#profile-full-name").value.trim(),
        username: form.querySelector("#profile-username").value.trim(),
        email: form.querySelector("#profile-email").value.trim(),
        phone: form.querySelector("#profile-phone").value.trim(),
        track: trackSelect.value,
        trackLabel: trackSelect.options[trackSelect.selectedIndex].text,
        location: form.querySelector("#profile-location").value.trim(),
        bio: form.querySelector("#profile-bio").value.trim(),
        role: registeredUser?.role || "student"
    };
}

function applyProfileData(profileData) {
    // Fill the form, profile header, overview, and avatar from saved data.
    if (!profileData) {
        return;
    }

    const profileForm = document.getElementById("profile-form");

    if (profileForm) {
        profileForm.querySelector("#profile-full-name").value = profileData.fullName || "";
        profileForm.querySelector("#profile-username").value = profileData.username || "";
        profileForm.querySelector("#profile-email").value = profileData.email || "";
        profileForm.querySelector("#profile-phone").value = profileData.phone || "";
        profileForm.querySelector("#profile-track").value = profileData.track || "frontend";
        profileForm.querySelector("#profile-location").value = profileData.location || "";
        profileForm.querySelector("#profile-bio").value = profileData.bio || "";
    }

    setText("profile-display-name", profileData.fullName || "Omar Habib");
    setText("profile-display-track", profileData.trackLabel || formatTrackLabel(profileData.track));
    setText("profile-overview-email", profileData.email || "omar@example.com");
    setText("profile-overview-role", (profileData.role || "student").replace(/^./, (letter) => letter.toUpperCase()));
    setText("profile-overview-track", profileData.trackLabel || formatTrackLabel(profileData.track));

    const avatar = document.getElementById("profile-avatar");

    if (avatar) {
        avatar.textContent = getInitials(profileData.fullName);
    }
}

function initializeProfilePage() {
    // Only run profile setup when this script is on the profile page.
    if (document.body?.dataset.page !== "profile") {
        return;
    }

    const savedProfile = readStorage(STORAGE_KEYS.profile);
    const savedUser = readStorage(STORAGE_KEYS.registeredUser);
    const profileData = savedProfile || buildProfileFromUser(savedUser);

    if (profileData) {
        applyProfileData(profileData);
    }
}

function initializeLogoutButton() {
    // Logout clears only the active session, not the saved registered account.
    const logoutButton = document.getElementById("logout-button");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEYS.currentUser);
        window.location.href = "omar-login.html";
    });
}

function handleRegisterSubmit(form, setFormMessage) {
    // Save the new account and create its first profile record.
    const account = {
        fullName: form.querySelector("#register-full-name").value.trim(),
        username: form.querySelector("#register-username").value.trim(),
        email: form.querySelector("#register-email").value.trim(),
        phone: form.querySelector("#register-phone").value.trim(),
        role: form.querySelector("#register-role").value,
        track: form.querySelector("#register-track").value,
        password: form.querySelector("#register-password").value
    };

    writeStorage(STORAGE_KEYS.registeredUser, account);
    writeStorage(STORAGE_KEYS.profile, buildProfileFromUser(account));
    writeStorage(STORAGE_KEYS.currentUser, {
        email: account.email,
        username: account.username
    });

    setFormMessage("Account created successfully. Redirecting to login...", "success");

    setTimeout(() => {
        window.location.href = "omar-login.html";
    }, 1000);
}

function handleLoginSubmit(form, setFormMessage, setFieldError) {
    // Compare the login form with the saved account.
    const email = form.querySelector("#login-email").value.trim();
    const password = form.querySelector("#login-password").value;
    const savedUser = readStorage(STORAGE_KEYS.registeredUser);

    if (!savedUser) {
        setFormMessage("No saved account was found. Please register first.", "error");
        return;
    }

    if (savedUser.email !== email) {
        setFieldError(form.querySelector("#login-email"), "This email does not match any registered account.");
        setFormMessage("Please check your email and try again.", "error");
        return;
    }

    if (savedUser.password !== password) {
        setFieldError(form.querySelector("#login-password"), "Incorrect password. Please try again.");
        setFormMessage("Your login details are incorrect.", "error");
        return;
    }

    writeStorage(STORAGE_KEYS.currentUser, {
        email: savedUser.email,
        username: savedUser.username
    });

    if (!readStorage(STORAGE_KEYS.profile)) {
        writeStorage(STORAGE_KEYS.profile, buildProfileFromUser(savedUser));
    }

    setFormMessage("Login successful. Opening your profile...", "success");

    setTimeout(() => {
        window.location.href = "omar-profile.html";
    }, 900);
}

function handleProfileSubmit(form, setFormMessage) {
    // Save profile edits and keep the account data in sync.
    const profileData = getProfileDataFromForm(form);
    const savedUser = readStorage(STORAGE_KEYS.registeredUser) || {};

    writeStorage(STORAGE_KEYS.profile, profileData);
    writeStorage(STORAGE_KEYS.registeredUser, {
        ...savedUser,
        fullName: profileData.fullName,
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        track: profileData.track,
        location: profileData.location,
        bio: profileData.bio
    });
    writeStorage(STORAGE_KEYS.currentUser, {
        email: profileData.email,
        username: profileData.username
    });

    applyProfileData(profileData);
    setFormMessage("Profile updated successfully.", "success");
}

window.EduverseAuth = {
    handleRegisterSubmit,
    handleLoginSubmit,
    handleProfileSubmit
};

initializeThemeToggle();
initializeProfilePage();
initializeLogoutButton();
updateAuthButtons();
updateMobileAuthLinks();
