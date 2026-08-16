import type { NextFunction, Request, Response } from "express";

import { tokenService } from "./token.service.js";
import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError(
        "Authentication required.",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError(
        "Invalid authorization header.",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const payload = await tokenService.verifyAccessToken(token);

    (req as AuthenticatedRequest).user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};