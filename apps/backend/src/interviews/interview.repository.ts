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
}

export const interviewRepository =
  new InterviewRepository();