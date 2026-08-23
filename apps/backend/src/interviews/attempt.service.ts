import { attemptRepository } from "./attempt.repository.js";
import { interviewRepository } from "./interview.repository.js";
import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";

export class AttemptService {
  constructor(
    private readonly repository = attemptRepository,
    private readonly interviews = interviewRepository
  ) {}

  async createAttempt(
    interviewId: string,
    userId: string
  ) {
    const interview =
      await this.interviews.findInterviewById(
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
        "Interview has already been completed.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    return this.repository.createAttempt(
      interviewId,
      userId
    );
  }

  async getAttempts(
    interviewId: string,
    userId: string
  ) {
    const interview =
      await this.interviews.findInterviewById(
        interviewId,
        userId
      );

    if (!interview) {
      throw new AppError(
        "Interview not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return this.repository.findAttemptsByInterview(
      interviewId,
      userId
    );
  }

  async getAttemptById(
    attemptId: string,
    interviewId: string,
    userId: string
  ) {
    const attempt =
      await this.repository.findAttemptById(
        attemptId,
        interviewId,
        userId
      );

    if (!attempt) {
      throw new AppError(
        "Attempt not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return attempt;
  }
}

export const attemptService =
  new AttemptService();