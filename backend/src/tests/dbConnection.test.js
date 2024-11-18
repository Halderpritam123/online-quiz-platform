require("dotenv").config();
const mongoose = require("mongoose");

describe("Database Connection", () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw error;
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should connect to the database successfully", async () => {
    const state = mongoose.connection.readyState;
    expect(state).toBe(1); // 1 indicates a successful connection
  });
});
