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
  const answers = await prisma.interviewAnswer.findMany({
    where: {
      attemptId,
      score: {
        not: null,
      },
    },
    include: {
      question: true,
    },
  });

  if (answers.length === 0) {
    return 0;
  }

  let earned = 0;
  let possible = 0;

  for (const answer of answers) {
    if (answer.question.type === "MCQ") {
      earned += answer.score ?? 0;
      possible += 1;
    } else {
      earned += answer.score ?? 0;
      possible += 10;
    }
  }

  if (possible === 0) {
    return 0;
  }

  return Number(((earned / possible) * 100).toFixed(2));
}
async getAttemptResult(attemptId: string) {
  return prisma.interviewAttempt.findUnique({
    where: {
      id: attemptId,
    },
    include: {
      answers: {
        include: {
          question: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}
}

export const attemptRepository =
  new AttemptRepository();