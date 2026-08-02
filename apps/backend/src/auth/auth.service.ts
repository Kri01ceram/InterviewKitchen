import type { RegisterDto } from "./dto/register.dto.js";
import type { RegisterResponseDto } from "./dto/register-response.dto.js";
import type { IAuthService } from "./interfaces/auth-service.interface.js";

import { authRepository } from "./auth.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import AppError from "../shared/errors/AppError.js";
import { AUTH_CONSTANTS } from "../shared/constants/auth.js";
import { HTTP_STATUS } from "../shared/constants/http.js";

export class AuthService implements IAuthService {
  constructor(
    private readonly repository = authRepository,
    private readonly password = passwordService,
    private readonly token = tokenService
  ) {}

  async register(
  data: RegisterDto
): Promise<RegisterResponseDto> {

  const existingUser =
    await this.repository.findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      "User with this email already exists.",
      HTTP_STATUS.CONFLICT
    );
  }

  const passwordHash =
    await this.password.hashPassword(data.password);

  const user =
    await this.repository.createUser({
      name: data.name,
      email: data.email,
      passwordHash,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
}

export const authService = new AuthService();