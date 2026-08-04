import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";

describe("Failed login attempt due to no existing account", () => {
  it("returns 401", async () => {
    const response = await request(app)
      .post("/api/v1/login")
      .send({ email: "test@gmail.com", password: "test" });

    expect(response.status).toBe(401);
    expect(response.body.error.message).toEqual(
      "Email or password is not valid",
    );
  });
});

describe("Failed login attempt due to not being verified", () => {
  it("returns 403", async () => {
    await User.create({
      email: "notVerified@gmail.com",
      password: "notVerified",
    });

    const response = await request(app)
      .post("/api/v1/login")
      .send({ email: "notVerified@gmail.com", password: "notVerified" });

    expect(response.status).toBe(403);
  });
});

describe("Successful login attempt", () => {
  it("returns jwt", async () => {
    await User.create({
      email: "temp@gmail.com",
      password: "temp",
      isVerified: true,
    });

    const response = await request(app)
      .post("/api/v1/login")
      .send({ email: "temp@gmail.com", password: "temp" });

    expect(response.status).toBe(200);
  });
});
