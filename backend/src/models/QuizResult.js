const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  quizId: { type: String, required: true }, // Unique identifier for the quiz
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      selectedOption: { type: String, required: true },
    },
  ], // Array of user's answers
  score: { type: Number, required: true }, // Total score achieved
  performanceReport: { type: Object }, // Detailed performance analysis (e.g., topic-wise breakdown)
}, { timestamps: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);
