import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { interviewRepository } from "./interview.repository.js";
import { attemptRepository } from "./attempt.repository.js";

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
        "Interview is already completed.",
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

  async completeAttempt(
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

    if (attempt.completedAt) {
      throw new AppError(
        "Attempt is already completed.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const answers =
      await this.repository.findAnswersForAttempt(
        attemptId
      );

    const score = answers.reduce(
      (total, answer) =>
        total + (answer.score ?? 0),
      0
    );

    return this.repository.completeAttempt(
  attemptId
);
  }
}

export const attemptService =
  new AttemptService();