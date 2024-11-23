const express = require("express");
const passport = require("passport");
const {
  signup,
  login,
  googleOAuth,
  googleOAuthCallback,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Google OAuth routes
router.get("/google", googleOAuth);
router.get(
  "/google/callback",
  passport.initialize(), // Initialize passport middleware
  googleOAuthCallback
);

module.exports = router;
