import type { NextFunction, Request, Response } from "express";

import AppError from "../shared/errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import type { UserRole } from "@prisma/client";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const user = (req as any).user;

    if (!user) {
      return next(
        new AppError(
          "Authentication required.",
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
};