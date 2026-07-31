import { prisma } from "../lib/prisma.js";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return prisma.user.create({
      data,
    });
  }
}

export const userRepository = new UserRepository();