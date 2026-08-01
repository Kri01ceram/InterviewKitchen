import { prisma } from "../lib/prisma.js";
import type { CreateUserDto } from "./dto/create-user.dto.js";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserDto) {
    return prisma.user.create({
      data,
    });
  }
}

export const authRepository = new AuthRepository();