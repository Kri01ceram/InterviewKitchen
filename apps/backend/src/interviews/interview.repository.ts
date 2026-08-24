import { InterviewStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { CreateInterviewDto } from "./dto/create-interview.dto.js";

export class InterviewRepository {
  async createInterview(
    userId: string,
    data: CreateInterviewDto
  ) {
    return prisma.interview.create({
  data: {
    title: data.title,
    type: data.type,
    difficulty: data.difficulty,
    status: "CREATED",
    userId,
  },
});
  }

  async findInterviewsByUser(userId: string) {
  return prisma.interview.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
  _count: {
    select: {
      questions: true,
      attempts: true,
    },
  },
  attempts: {
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    select: {
      id: true,
      score: true,
      startedAt: true,
      completedAt: true,
    },
  },
},
  });
}

  async findInterviewById(
    id: string,
    userId: string
  ) {
    return prisma.interview.findFirst({
      where: {
        id,
        userId,
      },
    });
  }
  async updateInterviewStatus(
  interviewId: string,
  status: InterviewStatus
) {
  return prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status,
    },
  });
}
async getDashboardStats(userId: string) {
  const [
    totalInterviews,
    completedInterviews,
    inProgressInterviews,
    attempts,
  ] = await Promise.all([
    prisma.interview.count({
      where: {
        userId,
      },
    }),

    prisma.interview.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),

    prisma.interview.count({
      where: {
        userId,
        status: "IN_PROGRESS",
      },
    }),

    prisma.interviewAttempt.findMany({
      where: {
        userId,
        completedAt: {
          not: null,
        },
        score: {
          not: null,
        },
      },
      select: {
        score: true,
      },
    }),
  ]);

  const scores = attempts
    .map((attempt) => attempt.score)
    .filter(
      (score): score is number => score !== null
    );

  const averageScore =
    scores.length > 0
      ? Number(
          (
            scores.reduce(
              (sum, score) => sum + score,
              0
            ) / scores.length
          ).toFixed(2)
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  return {
    totalInterviews,
    completedInterviews,
    inProgressInterviews,
    averageScore,
    bestScore,
  };
}
async getRecentAttempts(userId: string) {
  return prisma.interviewAttempt.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      score: true,
      startedAt: true,
      completedAt: true,
      interview: {
        select: {
          id: true,
          title: true,
          type: true,
          difficulty: true,
          status: true,
        },
      },
    },
  });
}
}

export const interviewRepository =
  new InterviewRepository();