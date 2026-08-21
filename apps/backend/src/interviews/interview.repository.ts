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
}

export const interviewRepository =
  new InterviewRepository();