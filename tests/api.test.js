const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

beforeAll(async () => {
  // clear the test database
  await mongoose.connection.dropDatabase();
});

describe("GET /api/hello", () => {
  it("should return a JSON object with greeting", async () => {
    const response = await request(app).get("/api/hello");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ greeting: "hello API" });
  });
});

const invalidURL = "https:/freecodecamp.org";
const validUrl = "https://freecodecamp.org";

describe("POST /api/shorturl", () => {
  let short_url;

  it("should return an error for invalid url", async () => {
    const response = await request(app).post("/api/shorturl").send({
      url: invalidURL,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "invalid url");
  });

  it("should return a JSON object with original_url and short_url", async () => {
    const response = await request(app)
      .post("/api/shorturl")
      .send({ url: validUrl });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("original_url", validUrl);
    expect(response.body).toHaveProperty("short_url");

    short_url = response.body.short_url;
  });

  describe("GET /api/shorturl/:short_url", () => {
    it("should redirect to the original url", async () => {
      const response = await request(app)
        .get(`/api/shorturl/${short_url}`)
        .expect(302);

      expect(response.headers.location).toBe(validUrl);
    });
  });
});
