const STORAGE_KEYS = {
    registeredUser: "eduverseRegisteredUser",
    currentUser: "eduverseCurrentUser",
    profile: "eduverseProfile",
    theme: "eduverseTheme"
};

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.getElementById("theme-toggle");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isActive = navLinks.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isActive));
    });
}

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }
}

function initializeThemeToggle() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "light";
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
            localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
            applyTheme(nextTheme);
        });
    }
}

function readStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        return null;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatTrackLabel(trackValue) {
    const trackLabels = {
        frontend: "Frontend Development",
        backend: "Backend Development",
        design: "UI/UX Design",
        business: "Business Skills"
    };

    return trackLabels[trackValue] || trackValue || "Frontend Development";
}

function getInitials(name) {
    return (name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "OH";
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function buildProfileFromUser(user) {
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

function handleRegisterSubmit(form, setFormMessage) {
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

