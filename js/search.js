document.addEventListener("DOMContentLoaded", () => {
    const courses = [
        {
            title: "Web Development",
            category: "Development",
            price: "Free",
            image: "../assets/images/web Course.webp"
        },
        {
            title: "Data Science",
            category: "Data Science",
            price: "$45",
            image: "../assets/images/Data Science.jpg"
        },
        {
            title: "UI/UX Design",
            category: "Design",
            price: "$30",
            image: "../assets/images/UI-UX.jpg"
        },
        {
            title: "JavaScript Projects",
            category: "Development",
            price: "$25",
            image: "../assets/images/javascript.webp"
        },
        {
            title: "Business Analytics",
            category: "Business",
            price: "$40",
            image: "../assets/images/business.jpg"
        },
        {
            title: "Design Thinking Basics",
            category: "Design",
            price: "Free",
            image: "../assets/images/design_thinking_course.webp"
        }
    ];

    const searchForm = document.getElementById("course-search-form");
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");
    const resultsContainer = document.getElementById("results-container");
    const resultsCount = document.getElementById("results-count");
    const viewButtons = document.querySelectorAll(".view-btn");

    let searchText = "";
    let currentView = "grid";

    const isCourseFree = (course) => course.price.toLowerCase() === "free";

    // Filters by search text, category, and price at the same time.
    const filterCourses = () => {
        return courses.filter((course) => {
            const matchesSearch = course.title.toLowerCase().includes(searchText);
            const matchesCategory = categoryFilter.value === "all" || course.category === categoryFilter.value;
            const matchesPrice =
                priceFilter.value === "all" ||
                (priceFilter.value === "free" && isCourseFree(course)) ||
                (priceFilter.value === "paid" && !isCourseFree(course));

            return matchesSearch && matchesCategory && matchesPrice;
        });
    };

    const createCourseCard = (course) => {
        const card = document.createElement("article");
        card.className = "search-card";

        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="search-card-content">
                <span>${course.category}</span>
                <h3>${course.title}</h3>
                <p>${course.price}</p>
                <a href="course-details.html" class="btn">View Details</a>
            </div>
        `;

        return card;
    };

    const updateResultsCount = (count) => {
        resultsCount.textContent = `${count} ${count === 1 ? "course" : "courses"}`;
    };

    const renderCourses = () => {
        const filteredCourses = filterCourses();

        resultsContainer.innerHTML = "";
        resultsContainer.className = `results-container ${currentView}-view`;
        updateResultsCount(filteredCourses.length);

        if (filteredCourses.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No courses found</p>';
            return;
        }

        filteredCourses.forEach((course) => {
            resultsContainer.appendChild(createCourseCard(course));
        });
    };

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        searchText = searchInput.value.trim().toLowerCase();
        renderCourses();
    });

    categoryFilter.addEventListener("change", renderCourses);
    priceFilter.addEventListener("change", renderCourses);

    viewButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentView = button.dataset.view;

            viewButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            renderCourses();
        });
    });

    renderCourses();
});
