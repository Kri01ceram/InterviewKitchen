import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { userRepository } from "./user.repository.js";

export class UserService {
  constructor(
    private readonly repository = userRepository
  ) {}

  async getMe(userId: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new AppError(
        "User not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return user;
  }
}

export const userService = new UserService();