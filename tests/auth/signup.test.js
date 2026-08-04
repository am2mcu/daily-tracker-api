import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Signup", () => {
  it("returns jwt token", async () => {
    const response = await request(app)
      .post("/api/v1/signup")
      .send({ email: "test@gmail.com", password: "test" });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("success");
  });
});
