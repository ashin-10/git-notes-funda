// server/config/mongo.js
const mongoose = require("mongoose");

function connectToMongo() {
  mongoose.connect("mongodb://localhost:27017/git_notes_funda", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
}

module.exports = { connectToMongo };
