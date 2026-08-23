import type { Request, Response } from "express";

import { questionService } from "./question.service.js";
import asyncHandler from "../shared/utils/async-handler.js";
import { successResponse } from "../shared/responses/api-response.js";
import { HTTP_STATUS } from "../shared/constants/http.js";


class QuestionController {
  create = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const question =
        await questionService.createQuestion(
          String(req.params.interviewId),
          userId,
          req.body
        );

      return successResponse(
        res,
        "Question created successfully.",
        { question },
        HTTP_STATUS.CREATED
      );
    }
  );

  getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const questions =
        await questionService.getQuestions(
          String(req.params.interviewId),
          userId
        );

      return successResponse(
        res,
        "Questions retrieved successfully.",
        { questions },
        HTTP_STATUS.OK
      );
    }
  );

  getById = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const question =
        await questionService.getQuestionById(
          String(req.params.id),
          String(req.params.interviewId),
          userId
        );

      return successResponse(
        res,
        "Question retrieved successfully.",
        { question },
        HTTP_STATUS.OK
      );
    }
  );
  update = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const question =
      await questionService.updateQuestion(
        String(req.params.id),
        String(req.params.interviewId),
        userId,
        req.body
      );

    return successResponse(
      res,
      "Question updated successfully.",
      { question },
      HTTP_STATUS.OK
    );
  }
);
delete = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    await questionService.deleteQuestion(
      String(req.params.id),
      String(req.params.interviewId),
      userId
    );

    return successResponse(
      res,
      "Question deleted successfully.",
      undefined,
      HTTP_STATUS.OK
    );
  }
);
}

export const questionController =
  new QuestionController();