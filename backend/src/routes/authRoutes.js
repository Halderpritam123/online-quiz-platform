const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Register the signup route
router.post("/signup", signup);

// Register the login route
router.post("/login", login);

module.exports = router;
