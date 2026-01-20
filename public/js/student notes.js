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

document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem("username") || "User";
    document.getElementById("profile-icon").textContent = username.charAt(0).toUpperCase();
    const modeToggle = document.getElementById("mode-toggle");
    const profileContainer = document.querySelector(".profile-container");
    const profileDropdown = document.getElementById("profile-dropdown");
    const notesContainer = document.getElementById("notes-container");
    const breadcrumbText = document.getElementById("breadcrumb-text");

    // Function to update the breadcrumb dynamically
    function updateBreadcrumb(branch, semester, subject) {
        breadcrumbText.textContent = `${branch} > ${semester} > ${subject}`;
    }


    // Fetch Notes for Student from Server
    function fetchNotes(branch, semester, subject) {
        fetch(`/api/notes?branch=${branch}&semester=${semester}&subject=${subject}`)
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    displayNotes(data);  // Directly pass the array of notes
                } else {
                    notesContainer.innerHTML = "<p>No notes available for this subject.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching notes:", error);
                notesContainer.innerHTML = "<p>Failed to load notes. Please try again later.</p>";
            });
    }
    
    // Display Notes
    // Display Notes
function displayNotes(notes) {
    notesContainer.innerHTML = ""; // Clear previous notes
    notes.forEach(note => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note-box");

        // Set default file icon
        let fileIcon = "📄"; // Default
        if (note.fileType && note.fileType.includes("pdf")) fileIcon = "📕";
        if (note.fileType && (note.fileType.includes("powerpoint") || note.fileType.includes("presentation"))) fileIcon = "📊";
        if (note.fileType && note.fileType.includes("image")) fileIcon = "🖼️";

        // Handle missing title and file size with fallback values
        const noteTitle = note.noteTitle || "Untitled Note";
        const fileName = note.fileName || "Unknown File";
        const fileSize = note.fileSize ? (note.fileSize / 1024).toFixed(2) : "0.00";

        // Construct the proper file URL using the backend route
        const fileUrl = `/api/notes/file/${note._id}`;

        noteElement.innerHTML = `
    <div>
        <h3>${fileIcon} ${noteTitle}</h3>
        <p>File: ${fileName}</p>
        <div class="note-actions">
            <button class="view-btn" onclick="viewFile('${fileUrl}')">View</button>
            <a href="${fileUrl}" download><button class="download-btn">Download</button></a>
        </div>
    </div>
`;

        notesContainer.appendChild(noteElement);
    });
}


    // View File Function
    window.viewFile = function(fileUrl) {
        // Open the file in a new tab
        window.open(fileUrl, "_blank");
    };

    // Dark Mode Toggle
    modeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        modeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });

    // Profile Dropdown Toggle
    profileContainer.addEventListener("click", function(event) {
        event.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(event) {
        if (!profileContainer.contains(event.target)) {
            profileDropdown.style.display = "none";
        }
    });

    // Example Selection (replace with dynamic logic)
    const currentSelection = {
        branch: localStorage.getItem("selectedBranch") || "Not Selected",
        semester: localStorage.getItem("selectedSemester") || "Not Selected",
        subject: localStorage.getItem("selectedSubject") || "Not Selected"
    };
    
    // Update breadcrumb and fetch notes based on selection
    updateBreadcrumb(currentSelection.branch, currentSelection.semester, currentSelection.subject);
    fetchNotes(currentSelection.branch, currentSelection.semester, currentSelection.subject);
});

// Logout Function
function logout() {
    // 🧹 Clear all authentication data
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    alert("👋 Logged out successfully!");
    window.location.href = "/login.html";
}

