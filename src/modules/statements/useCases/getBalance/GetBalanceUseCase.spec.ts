import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("[GetBalanceUseCase]", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@finapi.com",
      password: "12345",
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 100,
      description: "my birthday",
      type: "deposit" as OperationType,
    });

    const extract = await getBalanceUseCase.execute({ user_id: user.id });

    expect(extract).toHaveProperty("statement");
    expect(extract).toHaveProperty("balance");
  });

  it("should not be able get balance nonexisting user", () => {
    expect(
      async () => await getBalanceUseCase.execute({ user_id: "nonexisting" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
