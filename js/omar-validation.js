function getErrorElement(input) {
    return document.getElementById(`${input.id}-error`);
}

function setFieldError(input, message) {
    const errorElement = getErrorElement(input);

    input.classList.add("input-error");

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(input) {
    const errorElement = getErrorElement(input);

    input.classList.remove("input-error");

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function setFormMessage(form, message, type = "") {
    const messageElement = form.querySelector(".form-message");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;
    messageElement.classList.remove("error", "success");

    if (type) {
        messageElement.classList.add(type);
    }
}

function clearFormMessage(form) {
    const messageElement = form.querySelector(".form-message");

    if (messageElement) {
        messageElement.textContent = "";
        messageElement.classList.remove("error", "success");
    }
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
    return /^\+?[0-9][0-9\s-]{7,}$/.test(value);
}

function isStrongPassword(value) {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);
}

function validateField(input, form) {
    const value = input.type === "checkbox" ? input.checked : input.value.trim();
    let message = "";

    if (input.hasAttribute("required")) {
        if (input.type === "checkbox" && !value) {
            message = "You must agree before continuing.";
        } else if (input.type !== "checkbox" && !value) {
            message = `${input.labels?.[0]?.textContent || "This field"} is required.`;
        }
    }

    if (!message && input.name === "email" && value && !isValidEmail(value)) {
        message = "Enter a valid email address like name@example.com.";
    }

    if (!message && input.name === "phone" && value && !isValidPhone(value)) {
        message = "Enter a valid phone number with at least 8 digits.";
    }

    if (!message && input.name === "fullName" && value.length > 0 && value.length < 3) {
        message = "Full name must be at least 3 characters.";
    }

    if (!message && input.name === "username" && value.length > 0) {
        if (value.length < 3) {
            message = "Username must be at least 3 characters.";
        } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            message = "Username can only contain letters, numbers, and underscores.";
        }
    }

    if (!message && input.name === "password" && value && !isStrongPassword(value)) {
        message = "Password must be at least 8 characters and include at least one letter and one number.";
    }

    if (!message && input.name === "confirmPassword") {
        const passwordInput = form.querySelector('input[name="password"]');

        if (value && passwordInput && value !== passwordInput.value) {
            message = "Passwords do not match.";
        }
    }

    if (!message && input.name === "location" && value && value.length < 2) {
        message = "Location must be at least 2 characters.";
    }

    if (!message && input.name === "bio" && value.length > 180) {
        message = "Bio should be 180 characters or fewer.";
    }

    if (message) {
        setFieldError(input, message);
        return false;
    }

    clearFieldError(input);
    return true;
}

function validateForm(form) {
    let isFormValid = true;
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
        if (!validateField(field, form)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

document.querySelectorAll("form[novalidate]").forEach((form) => {
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
        field.addEventListener("input", () => {
            validateField(field, form);
            clearFormMessage(form);
        });

        field.addEventListener("blur", () => {
            validateField(field, form);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFormMessage(form);

        if (!validateForm(form)) {
            setFormMessage(form, "Please fix the highlighted fields and try again.", "error");
            return;
        }

        if (form.id === "register-form" && window.EduverseAuth) {
            window.EduverseAuth.handleRegisterSubmit(form, setFormMessage.bind(null, form));
            return;
        }

        if (form.id === "login-form" && window.EduverseAuth) {
            window.EduverseAuth.handleLoginSubmit(
                form,
                setFormMessage.bind(null, form),
                setFieldError
            );
            return;
        }

        if (form.id === "profile-form" && window.EduverseAuth) {
            window.EduverseAuth.handleProfileSubmit(form, setFormMessage.bind(null, form));
        }
    });
});