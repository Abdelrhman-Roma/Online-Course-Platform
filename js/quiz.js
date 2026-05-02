document.addEventListener("DOMContentLoaded", () => {
    const result = document.getElementById("quiz-result");
    const answers = document.querySelectorAll(".quiz-answer");

    answers.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!result) {
                return;
            }

            result.textContent = answer.dataset.correct === "true" ? "Correct answer." : "Try again.";
        });
    });
});
