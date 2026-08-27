import { prisma } from "../lib/prisma.js";
import type { UpdateAnswerDto } from "./dto/update-answer.dto.js";

export class AnswerRepository {
  async createAnswer(
    attemptId: string,
    questionId: string,
    answer: string,
    isCorrect: boolean | null,
    score: number | null,
    feedback: string | null
  ) {
    return prisma.interviewAnswer.create({
      data: {
        attemptId,
        questionId,
        answer,
        isCorrect,
        score,
        feedback,
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

  async findAnswerById(
    answerId: string,
    attemptId: string
  ) {
    return prisma.interviewAnswer.findFirst({
      where: {
        id: answerId,
        attemptId,
      },
    });
  }

  async updateAnswer(
    answerId: string,
    attemptId: string,
    data: UpdateAnswerDto
  ) {
    return prisma.interviewAnswer.update({
      where: {
        id: answerId,
      },
      data: {
        isCorrect: data.isCorrect,
        score: data.score,
        feedback: data.feedback,
      },
    });
  }
  async evaluateAnswer(
  answerId: string,
  attemptId: string,
  data: UpdateAnswerDto
) {
  return prisma.interviewAnswer.update({
    where: {
      id: answerId,
    },
    data: {
      isCorrect: data.isCorrect,
      score: data.score,
      feedback: data.feedback,
    },
  });
}
}

export const answerRepository =
  new AnswerRepository();