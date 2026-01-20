function showPopup() {
    const popup = document.getElementById("popup-container");

    if (!popup) {
        console.error("❌ Popup container not found in the DOM!");
        return;
    }

    console.log("✅ Showing popup...");
    
    popup.style.display = "flex"; // Ensure it's visible

    setTimeout(() => {
        closePopup();
    }, 2000); // Auto-close after 2 seconds
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById("popup-container");

    if (!popup) {
        console.error("❌ Popup container not found in the DOM!");
        return;
    }

    console.log("✅ Closing popup...");
    
    popup.style.display = "none";
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup-container").style.display = "none";
}

// Function to handle login button click
async function handleLogin(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate input fields
    if (!email || !password) {
        alert("⚠️ Please enter both email and password!");
        return;
    }

    try {
        // ✅ Use absolute path for API call
        const response = await fetch("http://localhost:5000/auth/login", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Store token (if using JWT)
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.name); // Store name for dashboard
            localStorage.setItem("loggedIn", "true");              // ✅ NEW: Store login status
            localStorage.setItem("userRole", data.role);           // ✅ NEW: Store user role
            // ✅ Show success popup before redirecting
            showPopup("🎉 Login Successful!");

            // ✅ Redirect based on role after a short delay
            setTimeout(() => {
                if (data.role === "faculty") {
                    window.location.href = "/faculty/faculty dashboard.html";
                } else if (data.role === "student") {
                    window.location.href = "/students/student dashboard.html";
                } else {
                    alert("❌ Invalid role! Please contact admin.");
                }
            }, 1500); // 1.5s delay for a smooth transition
        } else {
            alert(data.error || "❌ Login failed. Please try again!");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("⚠️ Server error! Please try again later.");
    }
}

// Attach event listener to form submission
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    if (form) form.addEventListener("submit", handleLogin);
});
