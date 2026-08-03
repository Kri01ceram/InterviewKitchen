import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { successResponse } from "../shared/responses/api-response.js";
import  asyncHandler  from "../shared/utils/async-handler.js";
import { HTTP_STATUS } from "../shared/constants/http.js";

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

  return successResponse(
    res,
    "Login successful.",
    data,
    HTTP_STATUS.OK
  );
});
}

export const authController = new AuthController();