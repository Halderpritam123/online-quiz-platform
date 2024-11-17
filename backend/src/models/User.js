const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google OAuth
  googleId: { type: String }, // For Google OAuth users
  profileData: { type: Object }, // Additional profile details
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model("User", userSchema);
