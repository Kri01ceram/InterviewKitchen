import type { Request, Response } from "express";
import asyncHandler from "../shared/utils/async-handler.js";
import { successResponse } from "../shared/responses/api-response.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { answerService } from "./answer.service.js";

class AnswerController {
  create = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const answer =
        await answerService.createAnswer(
          String(req.params.attemptId),
          req.body.questionId,
          userId,
          req.body
        );

      return successResponse(
        res,
        "Answer submitted successfully.",
        { answer },
        HTTP_STATUS.CREATED
      );
    }
  );

  getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const answers =
        await answerService.getAnswers(
          String(req.params.attemptId),
          userId
        );

      return successResponse(
        res,
        "Answers retrieved successfully.",
        { answers },
        HTTP_STATUS.OK
      );
    }
  );
  evaluate = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const answer =
  await answerService.evaluateAnswer(
    String(req.params.answerId),
    String(req.params.attemptId),
    String(req.params.interviewId),
    userId
  );
    return successResponse(
      res,
      "Answer evaluated successfully.",
      { answer },
      HTTP_STATUS.OK
    );
  }
);
}

export const answerController =
  new AnswerController();