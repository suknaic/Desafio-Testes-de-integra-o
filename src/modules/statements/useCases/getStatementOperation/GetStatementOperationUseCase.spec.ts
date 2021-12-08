import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("[GetStatementOperationUseCase]", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@finapi.com",
      password: "12345",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 100,
      description: "birthday",
      type: "deposit" as OperationType,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toBe(statement);
  });

  it("should not be able get statement the user nonexisting ", () => {
    expect(
      async () =>
        await getStatementOperationUseCase.execute({
          user_id: "nonexistingUserId",
          statement_id: "nonexistingStatementId",
        })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able get statement nonexisting", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@finapi.com",
      password: "12345",
    });
    expect(
      async () =>
        await getStatementOperationUseCase.execute({
          user_id: user.id,
          statement_id: "nonexistingStatementId",
        })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
