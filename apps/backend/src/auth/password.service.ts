import bcrypt from "bcrypt";
import { AUTH_CONSTANTS } from "../shared/constants/auth.js";


class PasswordService {
 
private readonly SALT_ROUNDS =
  AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}

export const passwordService = new PasswordService();