import type { RegisterDto } from "./dto/register.dto.js";
import type { RegisterResponseDto } from "./dto/register-response.dto.js";
import type { IAuthService } from "./interfaces/auth-service.interface.js";
import type { LoginDto } from "./dto/login.dto.js";


import { authRepository } from "./auth.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import AppError from "../shared/errors/AppError.js";
import { AUTH_CONSTANTS } from "../shared/constants/auth.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { AuthResponseDto } from "./dto/auth-response.dto.js";

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
async login(
  data: LoginDto
): Promise<AuthResponseDto> {

  const user = await this.repository.findUserByEmail(data.email);

  if (!user) {
    throw new AppError(
      "Invalid email or password.",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const passwordMatches =
  await this.password.verifyPassword(
    data.password,
    user.passwordHash
  );

if (!passwordMatches) {
  throw new AppError(
    "Invalid email or password.",
    HTTP_STATUS.UNAUTHORIZED
  );
}

const payload = {
  userId: user.id,
  email: user.email,
  role: user.role,
};

const accessToken =
  await this.token.generateAccessToken(payload);

const refreshToken =
  await this.token.generateRefreshToken(payload);

throw new Error("Not implemented.");
}
}

export const authService = new AuthService();