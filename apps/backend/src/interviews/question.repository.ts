import { prisma } from "../lib/prisma.js";
import type { CreateQuestionDto } from "./dto/create-question.dto.js";
import type { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { InterviewStatus, Prisma } from "@prisma/client";

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
    select: {
      id: true,
      question: true,
      type: true,
      options: true,
      explanation: true,
      interviewId: true,
      createdAt: true,
      updatedAt: true,
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
async deleteQuestion(
  questionId: string,
  interviewId: string
) {
  return prisma.interviewQuestion.deleteMany({
    where: {
      id: questionId,
      interviewId,
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
async createManyQuestions(
  interviewId: string,
  questions: CreateQuestionDto[]
) {
  return prisma.$transaction(
    questions.map((question) =>
      prisma.interviewQuestion.create({
        data: {
          interviewId,
          question: question.question,
          type: question.type,

          options:
            question.options == null
              ? Prisma.JsonNull
              : question.options,

          correctAnswer:
            question.correctAnswer ?? null,

          explanation:
            question.explanation ?? null,
        },
      })
    )
  );
}
}

export const questionRepository =
  new QuestionRepository();