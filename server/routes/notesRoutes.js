const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Note = require("../models/notes");

// Storage setup (uploads to /uploads folder at root level)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "..", "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now() + "-" + file.originalname;
    cb(null, uniqueFileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PPT, DOCX, and images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Get all notes
router.get("/", async (req, res) => {
  const { branch, semester, subject } = req.query;

  try {
    const notes = await Note.find({ branch, semester, subject });
    console.log("Notes found:", notes.length);
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes." });
  }
});

// Upload note
router.post("/upload", upload.single("noteFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const { noteTitle, branch, semester, subject, uploadedBy } = req.body;
  console.log("Received upload request:", { noteTitle, branch, semester, subject });
  console.log("File details:", req.file);

  try {
    const fileUrl = req.file.filename;

    const newNote = new Note({
      noteTitle,
      branch,
      semester,
      subject,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
      uploadedBy: uploadedBy || "Faculty"
    });

    const savedNote = await newNote.save();
    console.log("Note saved to database:", savedNote._id);

    res.status(201).json({
      message: "Note uploaded successfully.",
      note: savedNote
    });
  } catch (error) {
    console.error("Error saving note to database:", error);
    res.status(500).json({ message: "Failed to upload note." });
  }
});

// Get file by ID
router.get("/file/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", note.fileUrl);
    console.log("Attempting to access file:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);
      return res.status(404).json({ message: "File not found on server" });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", note.fileUrl);
    console.log("Attempting to delete file:", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully");
    } else {
      console.warn("File not found at path:", filePath);
    }

    await Note.findByIdAndDelete(noteId);
    console.log("Note deleted from database:", noteId);

    res.json({ message: "Note deleted successfully." });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Failed to delete note." });
  }
});

// Error handling
router.use((err, req, res, next) => {
  console.error("API error:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error.' });
  }
  res.status(500).json({ message: err.message || 'Something went wrong.' });
});

module.exports = router;
