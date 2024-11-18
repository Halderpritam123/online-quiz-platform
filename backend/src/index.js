// server.js (or index.js)
const express = require("express");
const dotenv = require("dotenv"); // Import dotenv for environment variable support
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./utils/errorHandler");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Example route for basic check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Error handling middleware (should be placed after all routes)
app.use(errorHandler);

// Connect to the database
connectDB();

// Only start the server if not in test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
