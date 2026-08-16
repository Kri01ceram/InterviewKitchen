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

  async createSession(data: {
    userId: string;
    hashedToken: string;
    expiresAt: Date;
    createdByIp?: string;
    userAgent?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.refreshToken.create({
        data: {
          userId: data.userId,
          hashedToken: data.hashedToken,
          expiresAt: data.expiresAt,
          createdByIp: data.createdByIp,
          userAgent: data.userAgent,
        },
      });

      await tx.user.update({
        where: {
          id: data.userId,
        },
        data: {
          lastLoginAt: new Date(),
        },
      });
    });
  }

  async findUserSessions(userId: string) {
    return prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });
  }

  async updateRefreshToken(
    sessionId: string,
    hashedToken: string,
    expiresAt: Date
  ) {
    return prisma.refreshToken.update({
      where: {
        id: sessionId,
      },
      data: {
        hashedToken,
        expiresAt,
      },
    });
  }

  async revokeRefreshToken(sessionId: string) {
    return prisma.refreshToken.update({
      where: {
        id: sessionId,
      },
      data: {
        revoked: true,
      },
    });
  }
}

export const authRepository = new AuthRepository();