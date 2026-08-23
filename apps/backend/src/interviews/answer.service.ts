import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { attemptRepository } from "./attempt.repository.js";
import { questionRepository } from "./question.repository.js";
import { answerRepository } from "./answer.repository.js";
import type { CreateAnswerDto } from "./dto/create-answer.dto.js";

export class AnswerService {
  constructor(
    private readonly repository = answerRepository,
    private readonly attempts = attemptRepository,
    private readonly questions = questionRepository
  ) {}

  async createAnswer(
    attemptId: string,
    questionId: string,
    userId: string,
    data: CreateAnswerDto
  ) {
    const attempt =
      await this.attempts.findAttemptByIdForUser(
        attemptId,
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
        "Cannot submit an answer to a completed attempt.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const question =
      await this.questions.findQuestionById(
        questionId,
        attempt.interviewId
      );

    if (!question) {
      throw new AppError(
        "Question not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    const existing =
      await this.repository.findAnswerByQuestion(
        attemptId,
        questionId
      );

    if (existing) {
      throw new AppError(
        "Answer already submitted for this question.",
        HTTP_STATUS.CONFLICT
      );
    }

    return this.repository.createAnswer(
      attemptId,
      questionId,
      data.answer
    );
  }

  async getAnswers(
    attemptId: string,
    userId: string
  ) {
    const attempt =
      await this.attempts.findAttemptByIdForUser(
        attemptId,
        userId
      );

    if (!attempt) {
      throw new AppError(
        "Attempt not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return this.repository.findAnswersByAttempt(
      attemptId
    );
  }
}

export const answerService =
  new AnswerService();