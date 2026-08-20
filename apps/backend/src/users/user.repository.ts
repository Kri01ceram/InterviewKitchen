import { prisma } from "../lib/prisma.js";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  
async updateName(id: string, name: string) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isEmailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
}


export const userRepository = new UserRepository();