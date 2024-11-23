const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const connectDB = require("./config/db");
const passport = require("./middlewares/passport"); // Import passport from middleware
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./utils/errorHandler");

dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware initialization
app.use(passport.initialize());
app.use(passport.session());

// Example route for basic check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to the database
connectDB();

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
