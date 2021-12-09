import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/";

describe("[ShowUserProfileController]", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "supertest",
      email: "supertest@finapi.com",
      password: "12345",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "supertest@finapi.com",
      password: "12345",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });
    expect(response.status).toBe(200);
  });

  it("should not be able to show user profile with invalid token", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer InvalidToken`,
    });
    expect(response.status).toBe(401);
  });
});
