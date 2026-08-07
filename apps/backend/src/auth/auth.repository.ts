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
async findRefreshToken(hashedToken: string) {
  return prisma.refreshToken.findUnique({
    where: {
      hashedToken,
    },
    include: {
      user: true,
    },
  });
}
async rotateSession(data: {
  oldHashedToken: string;
  newHashedToken: string;
  expiresAt: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.refreshToken.findUnique({
      where: {
        hashedToken: data.oldHashedToken,
      },
    });

    if (!session) {
      return null;
    }

    await tx.refreshToken.update({
      where: {
        id: session.id,
      },
      data: {
        hashedToken: data.newHashedToken,
        expiresAt: data.expiresAt,
      },
    });

    return session;
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