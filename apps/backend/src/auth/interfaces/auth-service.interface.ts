import type { LoginDto } from "../dto/login.dto.js";
import type { RegisterDto } from "../dto/register.dto.js";
import type { AuthResponseDto } from "../dto/auth-response.dto.js";

export interface IAuthService {
  register(data: RegisterDto): Promise<AuthResponseDto>;

  login(data: LoginDto): Promise<AuthResponseDto>;
}