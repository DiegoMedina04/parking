import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain/exceptions/CustomError';

export const globalExceptionHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  console.error('[GlobalErrorHandler] Unhandled error:', err);
  
  res.status(500).json({
    errors: [{ message: 'Something went wrong' }]
  });
};
