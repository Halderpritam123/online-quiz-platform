const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    // MongoDB URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
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
