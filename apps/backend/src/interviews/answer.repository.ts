import { prisma } from "../lib/prisma.js";

export class AnswerRepository {
  async createAnswer(
  attemptId: string,
  questionId: string,
  answer: string,
  isCorrect: boolean | null,
  score: number | null
) {
  return prisma.interviewAnswer.create({
    data: {
      attemptId,
      questionId,
      answer,
      isCorrect,
      score,
    },
  });
}

  async findAnswersByAttempt(
    attemptId: string
  ) {
    return prisma.interviewAnswer.findMany({
      where: {
        attemptId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findAnswerByQuestion(
    attemptId: string,
    questionId: string
  ) {
    return prisma.interviewAnswer.findUnique({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
    });
  }
  
}

export const answerRepository =
  new AnswerRepository();