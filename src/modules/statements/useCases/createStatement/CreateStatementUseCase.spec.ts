import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("[CreateStatementUseCase]", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const userTest = await inMemoryUsersRepository.create({
      name: "userTest",
      email: "test@finapi.com",
      password: "12345",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: userTest.id,
      amount: 100,
      description: "cash for father birthday ",
      type: "deposit" as OperationType,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not able to create a statement operation for nonexisting user", () => {
    expect(
      async () =>
        await createStatementUseCase.execute({
          user_id: "nonexisting",
          amount: 100,
          description: "shopping look",
          type: "deposit" as OperationType,
        })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw with insufficient balance", async () => {
    const userTest = await inMemoryUsersRepository.create({
      name: "userTest",
      email: "test@finapi.com",
      password: "12345",
    });

    expect(
      async () =>
        await createStatementUseCase.execute({
          user_id: userTest.id,
          amount: 100,
          description: "shopping look",
          type: "withdraw" as OperationType,
        })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
