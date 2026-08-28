import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { successResponse } from "../shared/responses/api-response.js";
import asyncHandler from "../shared/utils/async-handler.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { AUTH_CONSTANTS } from "../shared/constants/auth.js";
import { REFRESH_COOKIE_OPTIONS } from "../shared/constants/cookie.js";
import AppError from "../shared/errors/AppError.js";
import {
  AuthenticatedRequest,
  protect,
} from "./auth.middleware.js";

class AuthController {
  register = asyncHandler(
    async (req: Request, res: Response) => {
      const data = await authService.register(req.body);

      return successResponse(
        res,
        "User registered successfully.",
        data,
        HTTP_STATUS.CREATED
      );
    }
  );

  login = asyncHandler(
    async (req: Request, res: Response) => {
      const data = await authService.login(req.body);

      res.cookie(
        AUTH_CONSTANTS.COOKIE_NAME,
        data.refreshToken,
        REFRESH_COOKIE_OPTIONS
      );

      return successResponse(
        res,
        "Login successful.",
        {
          user: data.user,
          accessToken: data.accessToken,
        },
        HTTP_STATUS.OK
      );
    }
  );

  refresh = asyncHandler(
    async (req: Request, res: Response) => {
      const refreshToken =
        req.cookies?.[AUTH_CONSTANTS.COOKIE_NAME];

      if (!refreshToken) {
        throw new AppError(
          "Refresh token is required.",
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const data = await authService.refresh(refreshToken);

      res.cookie(
        AUTH_CONSTANTS.COOKIE_NAME,
        data.refreshToken,
        REFRESH_COOKIE_OPTIONS
      );

      return successResponse(
        res,
        "Token refreshed successfully.",
        {
          user: data.user,
          accessToken: data.accessToken,
        },
        HTTP_STATUS.OK
      );
    }
  );

  logout = asyncHandler(
    async (req: Request, res: Response) => {
      const refreshToken =
        req.cookies?.[AUTH_CONSTANTS.COOKIE_NAME];

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie(
        AUTH_CONSTANTS.COOKIE_NAME,
        REFRESH_COOKIE_OPTIONS
      );

      return successResponse(
        res,
        "Logged out successfully."
      );
    }
  );
  me = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    return successResponse(
      res,
      "User retrieved successfully.",
      {
        user,
      },
      HTTP_STATUS.OK
    );
  }
);
}

export const authController = new AuthController();