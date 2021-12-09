import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/";

describe("[AuthenticateUserController]", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "supertest",
      email: "supertest@finapi.com",
      password: "12345",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "supertest@finapi.com",
      password: "12345",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
