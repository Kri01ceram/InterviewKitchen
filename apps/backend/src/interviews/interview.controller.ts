import type { Request, Response } from "express";

import { interviewService } from "./interview.service.js";
import asyncHandler from "../shared/utils/async-handler.js";
import { successResponse } from "../shared/responses/api-response.js";
import { HTTP_STATUS } from "../shared/constants/http.js";



class InterviewController {
  create = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const interview =
        await interviewService.createInterview(
          userId,
          req.body
        );

      return successResponse(
        res,
        "Interview created successfully.",
        { interview },
        HTTP_STATUS.CREATED
      );
    }
  );

  getMine = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const interviews =
        await interviewService.getMyInterviews(userId);

      return successResponse(
        res,
        "Interviews retrieved successfully.",
        { interviews },
        HTTP_STATUS.OK
      );
    }
  );

  getById = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.userId;

      const interview =
        await interviewService.getInterviewById(
          String(req.params.id),
          userId
        );

      return successResponse(
        res,
        "Interview retrieved successfully.",
        { interview },
        HTTP_STATUS.OK
      );
    }
  );
  updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const interview =
      await interviewService.updateInterviewStatus(
        String(req.params.id),
        userId,
        req.body.status
      );

    return successResponse(
      res,
      "Interview status updated successfully.",
      { interview },
      HTTP_STATUS.OK
    );
  }
);
getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const stats =
      await interviewService.getDashboardStats(
        userId
      );

    return successResponse(
      res,
      "Dashboard statistics retrieved successfully.",
      { stats },
      HTTP_STATUS.OK
    );
  }
);
}

export const interviewController =
  new InterviewController();