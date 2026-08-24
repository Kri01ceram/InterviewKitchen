import type { CreateInterviewDto } from "./dto/create-interview.dto.js";
import { interviewRepository } from "./interview.repository.js";
import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import type { UpdateInterviewStatusDto } from "./dto/update-interview-status.dto.js";
import type { InterviewStatus } from "@prisma/client";

export class InterviewService {
  constructor(
    private readonly repository = interviewRepository
  ) {}

  async createInterview(
    userId: string,
    data: CreateInterviewDto
  ) {
    return this.repository.createInterview(
      userId,
      data
    );
  }

  async getMyInterviews(userId: string) {
    return this.repository.findInterviewsByUser(userId);
  }

  async getInterviewById(
    interviewId: string,
    userId: string
  ) {
    const interview =
      await this.repository.findInterviewById(
        interviewId,
        userId
      );

    if (!interview) {
      throw new AppError(
        "Interview not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return interview;
  }
  async updateInterviewStatus(
  interviewId: string,
  userId: string,
  status: InterviewStatus
) {
  const interview =
    await this.repository.findInterviewById(
      interviewId,
      userId
    );

  if (!interview) {
    throw new AppError(
      "Interview not found.",
      HTTP_STATUS.NOT_FOUND
    );
  }

  if (interview.status === "COMPLETED") {
    throw new AppError(
      "Completed interviews cannot change status.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (
    interview.status === "CREATED" &&
    status === "COMPLETED"
  ) {
    throw new AppError(
      "Interview must be in progress before it can be completed.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (
    interview.status === "IN_PROGRESS" &&
    status === "CREATED"
  ) {
    throw new AppError(
      "An interview in progress cannot be reset.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  return this.repository.updateInterviewStatus(
    interviewId,
    status
  );
}
}

export const interviewService =
  new InterviewService();