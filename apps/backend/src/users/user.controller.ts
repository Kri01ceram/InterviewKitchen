
import type { Request, Response } from "express";

import { userService } from "./user.service.js";
import asyncHandler from "../shared/utils/async-handler.js";
import { successResponse } from "../shared/responses/api-response.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import type { AuthenticatedRequest } from "../auth/auth.middleware.js";

class UserController {
  getMe = asyncHandler(
    async (req: Request, res: Response) => {
      const userId =
        (req as AuthenticatedRequest).user.userId;

      const user = await userService.getMe(userId);

      return successResponse(
        res,
        "User profile retrieved successfully.",
        { user },
        HTTP_STATUS.OK
      );
    }
  );
  updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId =
      (req as AuthenticatedRequest).user.userId;

    const user = await userService.updateProfile(
      userId,
      req.body.name
    );

    return successResponse(
      res,
      "Profile updated successfully.",
      { user },
      HTTP_STATUS.OK
    );
  }
);
changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId =
      (req as AuthenticatedRequest).user.userId;

    await userService.changePassword(
      userId,
      req.body.currentPassword,
      req.body.newPassword
    );

    return successResponse(
      res,
      "Password changed successfully.",
      undefined,
      HTTP_STATUS.OK
    );
  }
);
}

export const userController = new UserController();