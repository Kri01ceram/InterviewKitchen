import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { attemptRepository } from "./attempt.repository.js";
import { questionRepository } from "./question.repository.js";
import { answerRepository } from "./answer.repository.js";
import type { CreateAnswerDto } from "./dto/create-answer.dto.js";
import type { UpdateAnswerDto } from "./dto/update-answer.dto.js";

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

    let isCorrect: boolean | null = null;
    let score: number | null = null;
    let feedback: string | null = null;

    if (question.type === "MCQ") {
      isCorrect =
        data.answer.trim() ===
        question.correctAnswer?.trim();

      score = isCorrect ? 1 : 0;

      feedback = isCorrect
        ? "Correct answer."
        : "Incorrect answer.";
    }

    return this.repository.createAnswer(
      attemptId,
      questionId,
      data.answer,
      isCorrect,
      score,
      feedback
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

  async evaluateAnswer(
    answerId: string,
    attemptId: string,
    interviewId: string,
    userId: string,
    data: UpdateAnswerDto
  ) {
    const attempt =
      await this.attempts.findAttemptById(
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
        "Cannot evaluate an answer from a completed attempt.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const answer =
      await this.repository.findAnswerById(
        answerId,
        attemptId
      );

    if (!answer) {
      throw new AppError(
        "Answer not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (data.isCorrect && data.score === 0) {
  throw new AppError(
    "A correct answer must have a score greater than 0.",
    HTTP_STATUS.BAD_REQUEST
  );
}

if (!data.isCorrect && data.score > 0) {
  throw new AppError(
    "An incorrect answer cannot have a positive score.",
    HTTP_STATUS.BAD_REQUEST
  );
}

    return this.repository.updateAnswer(
      answerId,
      attemptId,
      data
    );
  }
}

export const answerService =
  new AnswerService();