// 📁 server/models/Subject.js
const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectList: {
    type: [String], // It's an array of strings
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subject", SubjectSchema, "subjects");
