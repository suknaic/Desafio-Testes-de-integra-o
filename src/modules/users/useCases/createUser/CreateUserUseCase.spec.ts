import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("[CreateUserUseCase]", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "userTest",
      email: "test@finap.com",
      password: "12345",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user if user already exists", async () => {
    await createUserUseCase.execute({
      name: "test",
      email: "test@finap.com",
      password: "12345",
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "test",
        email: "test@finap.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
