import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { userRepository } from "./user.repository.js";
import { passwordService } from "../auth/password.service.js";

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
  async updateProfile(userId: string, name: string) {
  const user = await this.repository.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found.",
      HTTP_STATUS.NOT_FOUND
    );
  }

  return this.repository.updateName(userId, name);
}
async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await this.repository.findByIdWithPassword(userId);

  if (!user) {
    throw new AppError(
      "User not found.",
      HTTP_STATUS.NOT_FOUND
    );
  }

  const passwordMatches =
    await passwordService.verifyPassword(
      currentPassword,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new AppError(
      "Current password is incorrect.",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const passwordHash =
    await passwordService.hashPassword(newPassword);

  await this.repository.updatePassword(
    userId,
    passwordHash
  );
}
}

export const userService = new UserService();