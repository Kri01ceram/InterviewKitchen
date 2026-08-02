import type { RegisterDto } from "../dto/register.dto.js";
import type { RegisterResponseDto } from "../dto/register-response.dto.js";

export interface IAuthService {
  register(
    data: RegisterDto
  ): Promise<RegisterResponseDto>;
}