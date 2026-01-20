const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

// ✅ User Registration
router.post("/register", async (req, res) => {
    const { role, name, email, password } = req.body;

    if (!role || !name || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (role, name, email, password) VALUES (?, ?, ?, ?)";

        db.query(sql, [role, name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: "Registration failed!" });

            res.json({ message: "User registered successfully!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 🔐 Create Session
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.name = user.name;

        res.json({
            message: "Login successful",
            name: user.name,
            role: user.role,
            redirect: user.role === "faculty" ? "/faculty/dashboard.html" : "/student/dashboard.html"
        });
    });
});

// ✅ Logout (optional)
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;
