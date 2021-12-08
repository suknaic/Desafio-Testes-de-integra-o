import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("[AuthenticateUserUseCase]", () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUserRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      name: "test",
      email: "test@finapi.com",
      password: "12345",
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: "test@finapi.com",
      password: "12345",
    });

    expect(authenticate.user).toHaveProperty("id");
    expect(authenticate).toHaveProperty("token");
  });

  it("should not be able authenticated user nonexisting", () => {
    expect(() =>
      authenticateUserUseCase.execute({
        email: "nonexistingUser@finapi.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
