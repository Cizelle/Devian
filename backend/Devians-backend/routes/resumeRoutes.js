// routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");

// POST /resumes (Create or update a resume)
router.post("/", async (req, res) => {
  try {
    const { userId, content } = req.body;

    // Check if a resume already exists for the user
    let resume = await Resume.findOne({ userId });

    if (resume) {
      // Update existing resume
      resume.content = content;
      await resume.save();
      res.json(resume);
    } else {
      // Create a new resume
      const newResume = new Resume({ userId, content });
      await newResume.save();
      res.status(201).json(newResume);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /resumes/:userId (Retrieve a user's resume)
router.get("/:userId", async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
