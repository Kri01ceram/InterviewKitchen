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
  async updateLastLogin(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}

async createRefreshToken(data: {
  userId: string;
  hashedToken: string;
  expiresAt: Date;
  createdByIp?: string;
  userAgent?: string;
}) {
  return prisma.refreshToken.create({
    data,
  });
}

  // async saveRefreshToken(data: {
  //   userId: string;
  //   hashedToken: string;
  //   expiresAt: Date;
  //   createdByIp?: string;
  //   userAgent?: string;
  // }) {
  //   return prisma.refreshToken.create({
  //     data,
  //   });
  // }
}

export const authRepository = new AuthRepository();