import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  status = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  } satisfies ApiResponse<T>);
}

export function errorResponse(
  res: Response,
  message: string,
  status = 500
) {
  return res.status(status).json({
    success: false,
    message,
  });
}