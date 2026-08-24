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

  async completeAttempt(attemptId: string) {
  const score =
    await this.calculateAttemptScore(attemptId);

  return prisma.interviewAttempt.update({
    where: {
      id: attemptId,
    },
    data: {
      completedAt: new Date(),
      score,
    },
  });
}
  async calculateAttemptScore(attemptId: string) {
  const result = await prisma.interviewAnswer.aggregate({
    where: {
      attemptId,
      score: {
        not: null,
      },
    },
    _sum: {
      score: true,
    },
    _count: {
      score: true,
    },
  });

  const totalQuestions = result._count.score;
  const totalScore = result._sum.score ?? 0;

  if (totalQuestions === 0) {
    return 0;
  }

  return (totalScore / totalQuestions) * 100;
}
}

export const attemptRepository =
  new AttemptRepository();