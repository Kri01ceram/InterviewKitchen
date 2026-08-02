import type { RegisterDto } from "../dto/register.dto.js";

export interface IAuthService {
  register(data: RegisterDto): Promise<unknown>;
}