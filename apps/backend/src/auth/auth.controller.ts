import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { successResponse } from "../shared/responses/api-response.js";
import  asyncHandler  from "../shared/utils/async-handler.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { AUTH_CONSTANTS } from "../shared/constants/auth.js";
import { env } from "../config/env.js";
import { REFRESH_COOKIE_OPTIONS } from "../shared/constants/cookie.js";

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
  login = asyncHandler(async (req: Request, res: Response) => {
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
});
}

export const authController = new AuthController();