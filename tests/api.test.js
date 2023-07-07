const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("GET /api/hello", () => {
  // clear the test database
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  test("should return a JSON object with greeting", async () => {
    const response = await request(app).get("/api/hello");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ greeting: "hello API" });
  });
});
