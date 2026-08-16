import type { LoginDto } from "../dto/login.dto.js";
import type { RegisterDto } from "../dto/register.dto.js";
import type { AuthResponseDto } from "../dto/auth-response.dto.js";
import type { RegisterResponseDto } from "../dto/register-response.dto.js";
export interface IAuthService {
  register(data: RegisterDto): Promise<RegisterResponseDto>;

  login(data: LoginDto): Promise<AuthResponseDto>;
  refresh(refreshToken: string): Promise<AuthResponseDto>;
  logout(refreshToken: string): Promise<void>;
  
}