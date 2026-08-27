import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { attemptRepository } from "./attempt.repository.js";
import { questionRepository } from "./question.repository.js";
import { answerRepository } from "./answer.repository.js";
import type { CreateAnswerDto } from "./dto/create-answer.dto.js";
import type { UpdateAnswerDto } from "./dto/update-answer.dto.js";
import { geminiAnswerEvaluator } from "../Ai/gemini.answer-evaluator.js";

export class AnswerService {
  constructor(
  private readonly repository = answerRepository,
  private readonly attempts = attemptRepository,
  private readonly questions = questionRepository,
  private readonly evaluator = geminiAnswerEvaluator
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
  userId: string
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

  const question =
    await this.questions.findQuestionById(
      answer.questionId,
      interviewId
    );

  if (!question) {
    throw new AppError(
      "Question not found.",
      HTTP_STATUS.NOT_FOUND
    );
  }

  if (question.type === "MCQ") {
    const isCorrect =
      answer.answer.trim() ===
      question.correctAnswer?.trim();

    return this.repository.evaluateAnswer(
      answerId,
      attemptId,
      {
        isCorrect,
        score: isCorrect ? 1 : 0,
        feedback: isCorrect
          ? "Correct answer."
          : "Incorrect answer.",
      }
    );
  }

  if (
    question.type === "SUBJECTIVE" ||
    question.type === "CODING"
  ) {
    const evaluation =
      await this.evaluator.evaluateAnswer({
        question: question.question,
        expectedAnswer: question.correctAnswer,
        userAnswer: answer.answer,
        questionType: question.type,
      });

    return this.repository.evaluateAnswer(
      answerId,
      attemptId,
      {
        isCorrect: evaluation.isCorrect,
        score: evaluation.score,
        feedback: evaluation.feedback,
      }
    );
  }

  throw new AppError(
    "Unsupported question type.",
    HTTP_STATUS.BAD_REQUEST
  );
}
}

export const answerService =
  new AnswerService();