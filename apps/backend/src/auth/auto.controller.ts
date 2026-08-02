import type { Request, Response, NextFunction } from "express";

import { authService } from "./auth.service.js";
import { successResponse } from "../shared/responses/api-response.js";
import type { RegisterDto } from "./dto/register.dto.js";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await authService.register(
        req.body as RegisterDto
      );

      return successResponse(
        res,
        "User registered successfully.",
        data,
        201
      );
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();