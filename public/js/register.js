// Function to show the success popup
function showPopup() {
    document.getElementById("popup-container").style.display = "flex";
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup-container").style.display = "none";
}

// Function to handle registration button click
async function handleRegistration(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get input values
    const role = document.getElementById("role").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate input fields
    if (!role || !name || !email || !password) {
        alert("Please fill all fields before registering!");
        return;
    }

    try {
        // ✅ Use absolute path for API call
        const response = await fetch("http://localhost:5000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role, name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Show success popup
            showPopup();

            // ✅ Redirect after successful registration
            setTimeout(() => {
                window.location.href = "/login.html"; // Redirect to login page
            }, 2000);
        } else {
            alert(data.error || "Registration failed. Please try again!");
        }
    } catch (error) {
        console.error("Error registering:", error);
        alert("Server error! Please try again later.");
    }
}

// Attach event listener to form submission
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");
    if (form) form.addEventListener("submit", handleRegistration);
});
