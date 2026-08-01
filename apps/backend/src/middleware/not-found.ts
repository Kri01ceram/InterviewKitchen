import { Request, Response, NextFunction } from "express";
import AppError from "../shared/errors/AppError.js";

export default function notFound(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}