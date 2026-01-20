const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  noteTitle: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    default: "Faculty"
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Note", noteSchema);