require("dotenv").config(); // Load environment variables
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,  // ✅ Add port here
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "AshNid7663#",
    database: process.env.DB_NAME || "git_notes_funda"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed: " + err.message);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

module.exports = db;
