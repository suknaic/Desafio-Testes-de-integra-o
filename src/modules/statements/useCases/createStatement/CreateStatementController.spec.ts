import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/";

describe("[CreateStatementController]", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create Statement of deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "supertest",
      email: "supertest@finapi.com",
      password: "12345",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "supertest@finapi.com",
      password: "12345",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "supertest statement deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create Statement of withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "supertest",
      email: "supertest@finapi.com",
      password: "12345",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "supertest@finapi.com",
      password: "12345",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "supertest statement withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "supertest statement withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
