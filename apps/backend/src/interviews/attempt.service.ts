import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { interviewRepository } from "./interview.repository.js";
import { attemptRepository } from "./attempt.repository.js";
import { questionRepository } from "./question.repository.js";
import { Prisma } from "@prisma/client";

export class AttemptService {
  constructor(
  private readonly repository = attemptRepository,
  private readonly interviews = interviewRepository,
  private readonly questions = questionRepository
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

    const activeAttempt =
      await this.repository.findActiveAttempt(
        interviewId,
        userId
      );

    if (activeAttempt) {
      throw new AppError(
        "An interview attempt is already in progress.",
        HTTP_STATUS.CONFLICT
      );
    }

    try {
      return await this.repository.createAttempt(
        interviewId,
        userId
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "An interview attempt is already in progress.",
          HTTP_STATUS.CONFLICT
        );
      }

      throw error;
    }
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
    const questions =
  await this.questions.findQuestionsByInterview(
    interviewId
  );
  if (questions.length === 0) {
  throw new AppError(
    "Cannot complete an attempt without any questions.",
    HTTP_STATUS.BAD_REQUEST
  );
}

const answers =
  await this.repository.findAnswersForAttempt(
    attemptId
  );

if (answers.length < questions.length) {
  throw new AppError(
    "Cannot complete the attempt until all questions are answered.",
    HTTP_STATUS.BAD_REQUEST
  );
}

        if (answers.some((answer) => answer.score === null)) {
          throw new AppError(
            "Cannot complete the attempt until all answers are evaluated.",
            HTTP_STATUS.BAD_REQUEST
          );
        }

    const completedAttempt =
      await this.repository.completeAttempt(
        attemptId
      );

    await this.interviews.updateInterviewStatus(
      interviewId,
      "COMPLETED"
    );

    return completedAttempt;
  }

  async getAttemptResult(
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

    if (!attempt.completedAt) {
      throw new AppError(
        "Attempt is not completed yet.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result =
  await this.repository.getAttemptResult(
    attemptId
  );

if (!result) {
  throw new AppError(
    "Attempt result not found.",
    HTTP_STATUS.NOT_FOUND
  );
}

return {
  attempt: {
    id: result.id,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
    score: result.score,
  },
  questions: result.answers.map((answer) => ({
    questionId: answer.questionId,
    question: answer.question.question,
    type: answer.question.type,
    answer: answer.answer,
    isCorrect: answer.isCorrect,
    score: answer.score,
    feedback: answer.feedback,
  })),
};
  }
}

export const attemptService =
  new AttemptService();