import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/";

describe("[GetStatementOperationController]", () => {
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

    const responseStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "supertest statement deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${responseStatement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
