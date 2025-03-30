// models/Roadmap.js
const mongoose = require("mongoose");

const RoadmapSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  userInput: {
    // Store the user's input to the AI
    goals: [String],
    skills: [String],
    other: String,
  },
  aiRoadmapId: {
    // Store the AI-generated roadmap identifier
    type: String, // Or whatever identifier your AI service provides
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);
