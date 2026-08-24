import type { Request, Response } from "express";
import asyncHandler from "../shared/utils/async-handler.js";
import { successResponse } from "../shared/responses/api-response.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { attemptService } from "./attempt.service.js";

class AttemptController {
  create = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const attempt =
        await attemptService.createAttempt(
          String(req.params.interviewId),
          userId
        );

      return successResponse(
        res,
        "Interview attempt started successfully.",
        { attempt },
        HTTP_STATUS.CREATED
      );
    }
  );

  getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const attempts =
        await attemptService.getAttempts(
          String(req.params.interviewId),
          userId
        );

      return successResponse(
        res,
        "Interview attempts retrieved successfully.",
        { attempts },
        HTTP_STATUS.OK
      );
    }
  );

  getById = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const attempt =
        await attemptService.getAttemptById(
          String(req.params.attemptId),
          String(req.params.interviewId),
          userId
        );

      return successResponse(
        res,
        "Interview attempt retrieved successfully.",
        { attempt },
        HTTP_STATUS.OK
      );
    }
  );

  complete = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const attempt =
        await attemptService.completeAttempt(
          String(req.params.attemptId),
          String(req.params.interviewId),
          userId
        );

      return successResponse(
        res,
        "Interview attempt completed successfully.",
        { attempt },
        HTTP_STATUS.OK
      );
    }
  );
  getResult = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result =
      await attemptService.getAttemptResult(
        String(req.params.attemptId),
        String(req.params.interviewId),
        userId
      );

    return successResponse(
      res,
      "Interview attempt result retrieved successfully.",
      { result },
      HTTP_STATUS.OK
    );
  }
);
}

export const attemptController =
  new AttemptController();