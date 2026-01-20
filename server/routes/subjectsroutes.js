const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject.js");

// POST /api/subjects/add - Add a subject to subjectList array
router.post("/add", async (req, res) => {
    const { branch, semester, subjectName } = req.body;
    console.log("📥 Adding subject:", { branch, semester, subjectName });
  
    try {
      // Find document with same branch & semester
      const existing = await Subject.findOne({ branch, semester });
  
      if (existing) {
        // Check if subject already exists in the list
        if (!existing.subjectList.includes(subjectName)) {
          existing.subjectList.push(subjectName);
          await existing.save();
          return res.status(200).json({ message: "Subject added to existing list." });
        } else {
          return res.status(200).json({ message: "Subject already exists." });
        }
      }
  
      // If no document, create new one
      const newDoc = new Subject({
        branch,
        semester,
        subjectList: [subjectName], // ✅ Save as array!
      });
  
      await newDoc.save();
      res.status(200).json({ message: "New subject list created." });
    } catch (err) {
      console.error("❌ Error adding subject:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// GET /api/subjects/get/:branch/:semester - Get subjects for a branch & semester
router.get("/get/:branch/:semester", async (req, res) => {
    const { branch, semester } = req.params;

    try {
        const subjects = await Subject.find({ branch, semester });
        res.status(200).json(subjects);
    } catch (err) {
        console.error("❌ Error fetching subjects:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
