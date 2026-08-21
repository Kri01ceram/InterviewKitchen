import type { CreateInterviewDto } from "./dto/create-interview.dto.js";
import { interviewRepository } from "./interview.repository.js";
import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";

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
}

export const interviewService =
  new InterviewService();