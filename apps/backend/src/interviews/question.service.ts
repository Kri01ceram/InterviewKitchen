import type { CreateQuestionDto } from "./dto/create-question.dto.js";
import { questionRepository } from "./question.repository.js";
import { interviewRepository } from "./interview.repository.js";
import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import type { UpdateQuestionDto } from "./dto/update-question.dto.js";

export class QuestionService {
  constructor(
    private readonly repository = questionRepository,
    private readonly interviews = interviewRepository
  ) {}

  async createQuestion(
    interviewId: string,
    userId: string,
    data: CreateQuestionDto
  ) {
    // Make sure the interview exists and belongs to this user.
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

    return this.repository.createQuestion(
      interviewId,
      data
    );
  }

  async getQuestions(
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

    return this.repository.findQuestionsByInterview(
      interviewId
    );
  }

  async getQuestionById(
    questionId: string,
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

    const question =
      await this.repository.findQuestionById(
        questionId,
        interviewId
      );

    if (!question) {
      throw new AppError(
        "Question not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return question;
  }
  async updateQuestion(
  questionId: string,
  interviewId: string,
  userId: string,
  data: UpdateQuestionDto
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

  const question =
    await this.repository.findQuestionById(
      questionId,
      interviewId
    );

  if (!question) {
    throw new AppError(
      "Question not found.",
      HTTP_STATUS.NOT_FOUND
    );
  }

  return this.repository.updateQuestion(
    questionId,
    interviewId,
    data
  );
}
async deleteQuestion(
  questionId: string,
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

  const question =
    await this.repository.findQuestionById(
      questionId,
      interviewId
    );

  if (!question) {
    throw new AppError(
      "Question not found.",
      HTTP_STATUS.NOT_FOUND
    );
  }

  await this.repository.deleteQuestion(
    questionId,
    interviewId
  );
}
}

export const questionService =
  new QuestionService();