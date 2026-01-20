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
    const addNotesBtn = document.getElementById("add-notes-btn");
    const addNotesPopup = document.getElementById("add-notes-popup");
    const notesContainer = document.getElementById("notes-container");
    const breadcrumbText = document.getElementById("breadcrumb-text");
    const noteUploadForm = document.getElementById("note-upload-form");

    // Dynamic Breadcrumb Management
    function updateBreadcrumb(branch, semester, subject) {
        breadcrumbText.textContent = `${branch} > ${semester} > ${subject}`;
    }

    // Get stored values for branch, semester, and subject
    const branch = localStorage.getItem("selectedBranch") || "CSE";
    const semester = localStorage.getItem("selectedSemester") || "Semester 1";
    const subject = localStorage.getItem("selectedSubject") || "Programming";

    updateBreadcrumb(branch, semester, subject);

    // File Upload Functionality
    async function uploadNote(event) {
        event.preventDefault();
    
        const titleInput = document.getElementById("note-title");
        const fileInput = document.getElementById("file-upload");
    
        if (!titleInput.value || !fileInput.files.length) {
            alert("Please enter a title and select a file.");
            return;
        }
    
        const formData = new FormData();
        formData.append("noteTitle", titleInput.value);
        formData.append("noteFile", fileInput.files[0]);
        formData.append("branch", branch);
        formData.append("semester", semester);
        formData.append("subject", subject);
        formData.append("uploadedBy", username);
    
        try {
            // Show loading indicator
            const uploadBtn = document.querySelector(".upload-btn");
            const originalBtnText = uploadBtn.textContent;
            uploadBtn.textContent = "Uploading...";
            uploadBtn.disabled = true;
            
            const response = await fetch("/api/notes/upload", {
                method: "POST",
                body: formData
            });
    
            // Reset button
            uploadBtn.textContent = originalBtnText;
            uploadBtn.disabled = false;
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Upload failed");
            }
            
            const result = await response.json();
            
            alert("Note uploaded successfully!");
            
            // Clear form and close popup
            noteUploadForm.reset();
            addNotesPopup.style.display = "none";
            
            // Refresh notes display
            loadNotes();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file: " + (error.message || "Unknown error"));
        }
    }
    
    // Load Notes Function
    async function loadNotes() {
        notesContainer.innerHTML = "<p>Loading notes...</p>";
    
        try {
            const queryParams = new URLSearchParams({
                branch: branch,
                semester: semester,
                subject: subject
            });
            
            const res = await fetch(`/api/notes?${queryParams}`);
            
            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }
            
            const notes = await res.json();
            notesContainer.innerHTML = ""; // Clear loading message
            
            if (Array.isArray(notes)) {
                if (notes.length === 0) {
                    notesContainer.innerHTML = "<p class='no-notes'>No notes available for this subject.</p>";
                } else {
                    notes.forEach(note => {
                        const noteElement = document.createElement("div");
                        noteElement.classList.add("note-box");
    
                        // Choose icon based on file type
                        let icon = "📄";
                        if (note.fileType && note.fileType.includes("pdf")) icon = "📕";
                        else if (note.fileType && (note.fileType.includes("powerpoint") || note.fileType.includes("presentation"))) icon = "📊";
                        else if (note.fileType && note.fileType.includes("image")) icon = "🖼️";
                        else if (note.fileType && (note.fileType.includes("word") || note.fileType.includes("document"))) icon = "📝";
    
                        noteElement.innerHTML = `
                            <div id="${note._id}">
                                <h3>${icon} ${note.noteTitle}</h3>
                                <p>Uploaded by: ${note.uploadedBy || 'Faculty'}</p>
                                <div class="note-actions">
                                    <button onclick="viewFile('${note._id}')">View</button>
                                    <a href="/api/notes/file/${note._id}" download="${note.fileName}" class="download-btn">Download</a>
                                    <button onclick="deleteNote('${note._id}')">Delete</button>
                                </div>
                            </div>
                        `;
                        notesContainer.appendChild(noteElement);
                    });
                }
            }
        } catch (err) {
            console.error("Error loading notes:", err);
            notesContainer.innerHTML = "<p class='error-message'>Failed to load notes. Please try again later.</p>";
        }
    }

    // View File Function - Global so it can be accessed from HTML
    window.viewFile = function(noteId) {
        // Use the API endpoint to view the file
        const fileUrl = `/api/notes/file/${noteId}`;
        console.log("Opening file via API:", fileUrl);
        window.open(fileUrl, '_blank');
    };

    // Delete Note Function - Global so it can be accessed from HTML
    window.deleteNote = async function(noteId) {
        if (!confirm("Are you sure you want to delete this note?")) return;
    
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                alert("Note deleted successfully.");
                // Refresh the notes list
                loadNotes();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to delete note.");
            }
        } catch (err) {
            console.error("Error deleting note:", err);
            alert("Error deleting note. Please try again.");
        }
    };
    
    // Dark Mode Toggle
    modeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        modeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        // Save preference to localStorage
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        modeToggle.textContent = "☀️";
    }

    // Profile Dropdown Toggle
    profileContainer.addEventListener("click", function(event) {
        event.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });

    // Hide Dropdown When Clicking Outside
    document.addEventListener("click", function(event) {
        if (!profileContainer.contains(event.target)) {
            profileDropdown.style.display = "none";
        }
    });

    // Add Notes Popup
    addNotesBtn.addEventListener("click", function() {
        addNotesPopup.style.display = "block";
    });

    // Close Notes Popup
    document.querySelector(".close-btn").addEventListener("click", function() {
        addNotesPopup.style.display = "none";
    });

    // Form Submission
    noteUploadForm.addEventListener("submit", uploadNote);
    
    // Load notes on page load
    loadNotes();
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

