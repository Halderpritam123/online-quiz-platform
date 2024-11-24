const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [array => array.length >= 2, "A question must have at least two options."],
  },
  correctOption: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 0 && value < this.options.length;
      },
      message: "Invalid correctOption. Must be a valid index of the options array.",
    },
  },
  difficultyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  tags: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Question", questionSchema);
