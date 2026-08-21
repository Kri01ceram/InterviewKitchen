import { prisma } from "../lib/prisma.js";
import type { CreateQuestionDto } from "./dto/create-question.dto.js";
import type { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { Prisma } from "@prisma/client";
export class QuestionRepository {
  async createQuestion(
    interviewId: string,
    data: CreateQuestionDto
  ) {
    return prisma.interviewQuestion.create({
      data: {
        question: data.question,
        type: data.type,
        options: data.options ?? undefined,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        interviewId,
      },
    });
  }

  async findQuestionsByInterview(
    interviewId: string
  ) {
    return prisma.interviewQuestion.findMany({
      where: {
        interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findQuestionById(
    questionId: string,
    interviewId: string
  ) {
    return prisma.interviewQuestion.findFirst({
      where: {
        id: questionId,
        interviewId,
      },
    });
  }
  async updateQuestion(
  questionId: string,
  interviewId: string,
  data: UpdateQuestionDto
) {
  return prisma.interviewQuestion.update({
    where: {
      id: questionId,
    },
    data: {
      ...(data.question !== undefined && {
        question: data.question,
      }),

      ...(data.type !== undefined && {
        type: data.type,
      }),

      ...(data.options !== undefined && {
        options:
          data.options === null
            ? Prisma.JsonNull
            : data.options,
      }),

      ...(data.correctAnswer !== undefined && {
        correctAnswer: data.correctAnswer,
      }),

      ...(data.explanation !== undefined && {
        explanation: data.explanation,
      }),
    },
  });
}
}

export const questionRepository =
  new QuestionRepository();