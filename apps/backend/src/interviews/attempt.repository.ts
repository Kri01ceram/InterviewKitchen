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

  async findAttemptByIdForUser(
    attemptId: string,
    userId: string
  ) {
    return prisma.interviewAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },
    });
  }

  async findAnswersForAttempt(
    attemptId: string
  ) {
    return prisma.interviewAnswer.findMany({
      where: {
        attemptId,
      },
    });
  }

  async completeAttempt(
    attemptId: string,
    score: number
  ) {
    return prisma.interviewAttempt.update({
      where: {
        id: attemptId,
      },
      data: {
        score,
        completedAt: new Date(),
      },
    });
  }
}

export const attemptRepository =
  new AttemptRepository();