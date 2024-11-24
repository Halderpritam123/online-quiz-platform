const request = require("supertest");
const app = require("../index");

// Mock admin credentials
const adminEmail = "admin@gmail.com";
const adminPassword = "admin";

// Mock tokens
let userToken;
let adminToken;

beforeAll(async () => {
  // Mock user login to generate tokens
  const userRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@gmail.com", password: "userpass" });
  userToken = userRes.body.token;

  const adminRes = await request(app)
    .post("/api/auth/login")
    .send({ email: adminEmail, password: adminPassword });
  adminToken = adminRes.body.token;
});

describe("Quiz Routes", () => {
  // Test for fetching a question
  describe("GET /api/quiz/start", () => {
    it("should fetch the next quiz question", async () => {
      const res = await request(app)
        .get("/api/quiz/start")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.question).toHaveProperty("_id");
      expect(res.body.question).toHaveProperty("text");
      expect(res.body.question.options).toHaveLength(4);
    });

    it("should return unauthorized error if no token is provided", async () => {
      const res = await request(app).get("/api/quiz/start");
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Unauthorized. Please log in.");
    });
  });

  // Test for submitting an answer
  describe("POST /api/quiz/submit", () => {
    it("should submit a correct answer", async () => {
      const questionId = "64f123456789abcd1234efgh"; // Replace with a valid question ID
      const res = await request(app)
        .post("/api/quiz/submit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ questionId, selectedOption: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isCorrect).toBe(true);
      expect(res.body.message).toBe("Correct answer!");
    });

    it("should submit an incorrect answer", async () => {
      const questionId = "64f123456789abcd1234efgh"; // Replace with a valid question ID
      const res = await request(app)
        .post("/api/quiz/submit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ questionId, selectedOption: 2 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isCorrect).toBe(false);
      expect(res.body.message).toBe("Wrong answer. Try again.");
    });

    it("should return error if question ID is invalid", async () => {
      const res = await request(app)
        .post("/api/quiz/submit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ questionId: "invalid_id", selectedOption: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Question not found.");
    });
  });

  // Test for creating a question (Admin only)
  describe("POST /api/quiz/create", () => {
    it("should create a quiz question as an admin", async () => {
      const newQuestion = {
        text: "What is the capital of Japan?",
        options: ["Tokyo", "Osaka", "Nagoya", "Kyoto"],
        correctOption: 0,
        difficultyLevel: 5,
        tags: ["geography"],
      };
      const res = await request(app)
        .post("/api/quiz/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newQuestion);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Question created successfully.");
      expect(res.body.question).toHaveProperty("_id");
    });

    it("should return unauthorized error for a non-admin user", async () => {
      const newQuestion = {
        text: "What is the capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        correctOption: 1,
        difficultyLevel: 5,
        tags: ["geography"],
      };
      const res = await request(app)
        .post("/api/quiz/create")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newQuestion);
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Unauthorized. Only admins can perform this action.");
    });
  });

  // Test for updating a question (Admin only)
  describe("PUT /api/quiz/update/:id", () => {
    it("should update a quiz question as an admin", async () => {
      const questionId = "64fabcdef123456789abcd"; // Replace with a valid question ID
      const updatedData = {
        text: "Updated question text",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctOption: 2,
        difficultyLevel: 6,
        tags: ["updated_tag"],
      };
      const res = await request(app)
        .put(`/api/quiz/update/${questionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Question updated successfully.");
    });

    it("should return not found error for an invalid question ID", async () => {
      const res = await request(app)
        .put("/api/quiz/update/invalid_id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          text: "Invalid question",
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Question not found.");
    });

    it("should return unauthorized error for a non-admin user", async () => {
      const questionId = "64fabcdef123456789abcd"; // Replace with a valid question ID
      const res = await request(app)
        .put(`/api/quiz/update/${questionId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          text: "Updated question text",
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Unauthorized. Only admins can perform this action.");
    });
  });
});
