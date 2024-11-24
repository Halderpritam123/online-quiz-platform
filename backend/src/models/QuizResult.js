const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
  suggestions: { type: [String], required: true },
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
