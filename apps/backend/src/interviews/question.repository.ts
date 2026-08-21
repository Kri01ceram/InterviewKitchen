import { prisma } from "../lib/prisma.js";
import type { CreateQuestionDto } from "./dto/create-question.dto.js";

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
}

export const questionRepository =
  new QuestionRepository();