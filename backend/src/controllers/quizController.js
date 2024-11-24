const Question = require("../models/Question");
const User = require("../models/User"); // Assuming a User model exists

// Middleware to check admin credentials
const checkAdmin = async (req, res, next) => {
  try {
    const { email, role } = req.user; // Extract email and role from the authenticated user
    if (role === "admin" && email === "admin@gmail.com") {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Unauthorized. Only admins can perform this action.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking admin credentials.",
    });
  }
};

// Fetch a single question for the quiz
const getNextQuestion = async (req, res) => {
  try {
    const { questionId } = req.query; // ID of the current question (if any)
    let nextQuestion;

    if (questionId) {
      nextQuestion = await Question.findOne({ _id: { $gt: questionId } })
        .sort({ _id: 1 })
        .limit(1); // Fetch the next question after the given ID
    } else {
      nextQuestion = await Question.findOne().sort({ _id: 1 }); // Fetch the first question
    }

    if (!nextQuestion) {
      return res.status(404).json({
        success: false,
        message: "No more questions available.",
      });
    }

    return res.status(200).json({
      success: true,
      question: nextQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the next question.",
      error: error.message,
    });
  }
};

// Submit an answer for a single question
const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;

    if (!questionId || typeof selectedOption !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Provide questionId and selectedOption.",
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Check if the answer is correct
    const isCorrect = question.correctOption === selectedOption;

    // Update the question's difficulty level
    if (isCorrect) {
      question.difficultyLevel = Math.min(question.difficultyLevel + 1, 10);
    } else {
      question.difficultyLevel = Math.max(question.difficultyLevel - 1, 1);
    }

    await question.save(); // Save the updated difficulty level

    return res.status(200).json({
      success: true,
      isCorrect,
      message: isCorrect ? "Correct answer!" : "Wrong answer. Try again.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit the answer.",
      error: error.message,
    });
  }
};

// Create a new quiz question (admin-only)
const createQuestion = async (req, res) => {
  try {
    const { text, options, correctOption, difficultyLevel, tags } = req.body;

    if (!text || !Array.isArray(options) || options.length < 2 || correctOption === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Ensure text, options, and correctOption are provided.",
      });
    }

    const question = new Question({
      text,
      options,
      correctOption,
      difficultyLevel: difficultyLevel || 1,
      tags,
    });

    await question.save();

    return res.status(201).json({
      success: true,
      message: "Question created successfully.",
      question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create question.",
      error: error.message,
    });
  }
};

// Update an existing quiz question (admin-only)
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params; // Question ID from the route parameter
    const { text, options, correctOption, difficultyLevel, tags } = req.body;

    // Validate input
    if (options && (!Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({
        success: false,
        message: "Options must be an array with at least two options.",
      });
    }

    if (
      typeof correctOption === "number" &&
      (correctOption < 0 || (options && correctOption >= options.length))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid correctOption. Must be a valid index of the options array.",
      });
    }

    if (difficultyLevel && (difficultyLevel < 1 || difficultyLevel > 10)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficultyLevel. Must be between 1 and 10.",
      });
    }

    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { text, options, correctOption, difficultyLevel, tags },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update question.",
      error: error.message,
    });
  }
};

module.exports = {
  checkAdmin,
  getNextQuestion,
  submitAnswer,
  createQuestion,
  updateQuestion,
};
