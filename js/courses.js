document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card .btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.setAttribute("aria-busy", "false");
        });
    });
});
