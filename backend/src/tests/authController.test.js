require("dotenv").config();
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index"); // Assuming the Express app is in index.js
const User = require("../models/User");

describe("User Authentication", () => {
  // Change port for testing to avoid conflicts
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clear collections instead of dropping the database
    await User.deleteMany({});  // Clear all users from the User collection
    await mongoose.connection.close();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user successfully", async () => {
      const response = await supertest(app)
        .post("/api/auth/signup")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        });

      expect(response.status).toBe(201); // Created
      expect(response.body.message).toBe("User created successfully");
    });

    it("should return an error if email is already in use", async () => {
      // Create user first
      await supertest(app)
        .post("/api/auth/signup")
        .send({
          name: "Jane Doe",
          email: "janedoe@example.com",
          password: "password123",
        });

      // Try to create the same email again
      const response = await supertest(app)
        .post("/api/auth/signup")
        .send({
          name: "Jane Duplicate",
          email: "janedoe@example.com",
          password: "password123",
        });

      expect(response.status).toBe(400); // Bad Request
      expect(response.body.error).toBe("Email already in use");
    });

    it("should return an error if required fields are missing", async () => {
      const response = await supertest(app)
        .post("/api/auth/signup")
        .send({
          name: "John Doe",
          // Missing email and password
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Name, email, and password are required");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login the user successfully with correct credentials", async () => {
      const response = await supertest(app)
        .post("/api/auth/login")
        .send({
          email: "johndoe@example.com", // Use a valid email from signup
          password: "password123", // Use correct password
        });

      expect(response.status).toBe(200); // OK
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toHaveProperty("name");
      expect(response.body.user.name).toBe("John Doe");
    });

    it("should return an error for invalid credentials", async () => {
      const response = await supertest(app)
        .post("/api/auth/login")
        .send({
          email: "johndoe@example.com", // Valid email
          password: "wrongpassword", // Invalid password
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should return an error if required fields are missing", async () => {
      const response = await supertest(app)
        .post("/api/auth/login")
        .send({
          email: "johndoe@example.com", // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email and password are required");
    });
  });
});
