import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("[ShowUserProfileUseCase]", () => {
  let inMemoryUserRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
  });

  it("should be able to show user profile", async () => {
    const { id } = await inMemoryUserRepository.create({
      name: "test",
      email: "test@finap.com",
      password: "12345",
    });

    const user = await showUserProfileUseCase.execute(id);

    expect(user).toHaveProperty("id");
  });

  it("should not be able to show profile if user nonexisting", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("nonExistingId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
