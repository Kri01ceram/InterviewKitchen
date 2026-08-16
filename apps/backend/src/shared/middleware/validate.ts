import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { errors as joseErrors } from "jose";

import AppError from "../errors/AppError.js";
import { HTTP_STATUS } from "../constants/http.js";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          result.error.issues[0]?.message ?? "Validation failed.",
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }

    req.body = result.data;

    next();
  };