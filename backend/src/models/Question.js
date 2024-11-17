const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true }, // Array of answer options
  correctAnswer: { type: String, required: true }, // Correct answer text
  difficultyLevel: { type: Number, required: true }, // Difficulty level (e.g., 1-5)
  topics: { type: [String], required: true }, // Tags like "algebra", "geometry"
}, { timestamps: true }); // Automatically track creation and update times

module.exports = mongoose.model("Question", questionSchema);
