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

// Load and display selected Branch & Semester
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
    }
}

// ✅ Display subjects on the page
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
                window.location.href = "faculty notes.html";
            };
            
            container.appendChild(box);
        });
    });    
}


// ✅ Add subject and send it to backend
async function addSubject() {
    const subjectName = document.getElementById("subject-name").value.trim();
    const branch = localStorage.getItem("selectedBranch");
    const semester = localStorage.getItem("selectedSemester");

    if (!subjectName) {
        alert("Please enter a subject name.");
        return;
    }

    try {
        const res = await fetch("/api/subjects/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subjectName, branch, semester })
        });

        const result = await res.json();
        alert(result.message || "Subject added!");
        closePopup();
        fetchSubjectsFromDB();  // Refresh subjects
    } catch (error) {
        console.error("Error adding subject:", error);
        alert("Something went wrong.");
    }
}

// 👇 Dark Mode + Profile Setup (unchanged)
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


function openPopup() {
    document.getElementById("popup-container").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup-container").style.display = "none";
}
