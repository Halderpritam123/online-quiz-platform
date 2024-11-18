const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    // MongoDB URI from environment variables
    const dbURI = process.env.MONGO_URI;
    if (!dbURI) {
      console.error("MongoDB URI is missing in environment variables.");
      process.exit(1); // Exit if URI is not provided
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectDB;
