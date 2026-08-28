import type { CreateQuestionDto } from "./dto/create-question.dto.js";
import { questionRepository } from "./question.repository.js";
import { interviewRepository } from "./interview.repository.js";
import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import type { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { aiService } from "../Ai/ai.provider.js";

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

    if (interview.status !== "CREATED") {
  throw new AppError(
    "Cannot modify questions after the interview has started.",
    HTTP_STATUS.BAD_REQUEST
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
    

    if (interview.status !== "CREATED") {
  throw new AppError(
    "Cannot modify questions after the interview has started.",
    HTTP_STATUS.BAD_REQUEST
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

   if (interview.status !== "CREATED") {
  throw new AppError(
    "Cannot modify questions after the interview has started.",
    HTTP_STATUS.BAD_REQUEST
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
  async generateQuestions(
  interviewId: string,
  userId: string,
  count: number
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
      "Cannot generate questions for a completed interview.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (interview.status !== "CREATED") {
    throw new AppError(
      "Cannot generate questions after the interview has started.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const generated =
    await aiService.generateQuestions({
      type: interview.type,
      questionType: interview.questionType,
      difficulty: interview.difficulty,
      count,
    });

  return this.repository.createManyQuestions(
    interviewId,
    generated
  );
}
}

export const questionService =
  new QuestionService();