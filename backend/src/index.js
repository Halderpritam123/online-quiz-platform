const express = require("express");
const dotenv = require("dotenv"); // Import dotenv
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables from .env file

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Example routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
