import type { IAuthService } from "./interfaces/auth-service.interface.js";

export class AuthService implements IAuthService {
  async register() {
    throw new Error("Not implemented.");
  }
}

export const authService = new AuthService();