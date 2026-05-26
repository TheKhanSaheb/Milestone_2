import type { NextFunction, Request, Response } from "express";

interface AppError {
  statusCode?: number;
  message?: string;
}

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandler;