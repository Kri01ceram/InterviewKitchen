import { prisma } from "../lib/prisma.js";

export class AttemptRepository {
  async createAttempt(
    interviewId: string,
    userId: string
  ) {
    return prisma.interviewAttempt.create({
      data: {
        interviewId,
        userId,
      },
    });
  }

  async findAttemptsByInterview(
    interviewId: string,
    userId: string
  ) {
    return prisma.interviewAttempt.findMany({
      where: {
        interviewId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAttemptById(
    attemptId: string,
    interviewId: string,
    userId: string
  ) {
    return prisma.interviewAttempt.findFirst({
      where: {
        id: attemptId,
        interviewId,
        userId,
      },
    });
  }

  async completeAttempt(
    attemptId: string
  ) {
    return prisma.interviewAttempt.update({
      where: {
        id: attemptId,
      },
      data: {
        completedAt: new Date(),
      },
    });
  }
}

export const attemptRepository =
  new AttemptRepository();