const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'], // Email format validation
    },
    password: {
      type: String,
      minlength: [6, 'Password should be at least 6 characters'], // Password length validation
      // Optional: Add more password strength validation here
    },
    googleId: { type: String }, // For Google OAuth users
    profileData: { type: mongoose.Schema.Types.Mixed }, // Flexible structure for profile details

  },
  { timestamps: true }
);

// Ensuring either password or googleId is present, but not both
userSchema.pre("save", function (next) {
  if (this.password && this.googleId) {
    throw new Error("Cannot set both password and googleId");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
