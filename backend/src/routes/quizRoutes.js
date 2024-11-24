const express = require("express");
const router = express.Router();
const {
  checkAdmin,
  getNextQuestion,
  submitAnswer,
  createQuestion,
  updateQuestion,
} = require("../controllers/quizController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route to fetch the next question
router.get("/start", authMiddleware, getNextQuestion);

// Route to submit an answer
router.post("/submit", authMiddleware, submitAnswer);

// Admin routes
router.post("/create", authMiddleware, checkAdmin, createQuestion);
router.put("/update/:id", authMiddleware, checkAdmin, updateQuestion);

module.exports = router;
