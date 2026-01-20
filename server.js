const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session"); // ✅ Session
require("dotenv").config();
const { connectToMongo } = require("./server/config/mongo.js");

connectToMongo(); // Connect MongoDB

const authRoutes = require("./server/routes/authRoutes.js");
const db = require("./server/config/db.js");
const subjectsRoutes = require("./server/routes/subjectsroutes.js");
const notesRoutes = require("./server/routes/notesRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Setup express-session BEFORE routes
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Use true only if HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/notes", notesRoutes);

// ✅ Check session route (optional)
app.get("/api/check-session", (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      name: req.session.name,
      role: req.session.role
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// Fallback for unknown routes
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
