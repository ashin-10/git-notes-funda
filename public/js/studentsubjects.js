// 🚫 Protect page from direct access
const isLoggedIn = localStorage.getItem("loggedIn");
const userRole = localStorage.getItem("userRole");

if (!isLoggedIn || !userRole) {
    alert("🚫 Unauthorized access! Please login first.");
    window.location.href = "/login.html"; // Redirect to login page
}

function goBack() {
        window.history.back(); // or use location.href = "student/dashboard.html";
}

document.addEventListener("DOMContentLoaded", function () {
    loadBranchSemester();
    fetchSubjectsFromDB();  // ✅ Load from MongoDB
    setupDarkMode();
    setupProfile();
});

// ✅ Load and display selected Branch & Semester
function loadBranchSemester() {
    let branch = localStorage.getItem("selectedBranch") || "Computer Science and Engineering";
    let semester = localStorage.getItem("selectedSemester") || "1st Semester";
    document.getElementById("branch-bar").textContent = `${branch} > ${semester}`;
}

// ✅ Fetch subjects from backend (MongoDB)
async function fetchSubjectsFromDB() {
    const branch = localStorage.getItem("selectedBranch");
    const semester = localStorage.getItem("selectedSemester");

    try {
        const response = await fetch(`/api/subjects/get/${encodeURIComponent(branch)}/${encodeURIComponent(semester)}`);
        const subjects = await response.json();

        displaySubjects(subjects);
    } catch (error) {
        console.error("Error loading subjects:", error);
        document.getElementById("subject-container").innerHTML = "<p>Error loading subjects. Please try again later.</p>";
    }
}

// ✅ Display subjects on the page (Student View)
function displaySubjects(subjects) {
    const container = document.getElementById("subject-container");
    container.innerHTML = "";

    if (subjects.length === 0) {
        container.innerHTML = "<p>No subjects found for this branch and semester.</p>";
        return;
    }

    subjects.forEach(({ subjectList }) => {
        subjectList.forEach(subject => {
            let box = document.createElement("div");
            box.classList.add("subject-box");
            box.textContent = subject;
            box.onclick = () => {
                localStorage.setItem("selectedSubject", subject);
                window.location.href = "student notes.html";
            };
            container.appendChild(box);
        });
    });
}

// 👇 Dark Mode + Profile Setup (kept same as faculty)
function setupDarkMode() {
    const modeToggle = document.getElementById("mode-toggle");
    const body = document.body;
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        body.classList.add("dark-mode");
        modeToggle.textContent = "☀️";
    }

    modeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
        modeToggle.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });
}

// 👇 Profile initials and logout
function setupProfile() {
    const username = localStorage.getItem("username") || "A";
    document.getElementById("profile-icon").textContent = username.charAt(0).toUpperCase();
}

function toggleDropdown() {
    document.getElementById("profile-dropdown").classList.toggle("show");
}

function logout() {
    // 🧹 Clear all authentication data
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    alert("👋 Logged out successfully!");
    window.location.href = "/login.html";
}

