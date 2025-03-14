import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const validateRequest = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }

    res.status(500).json({ message: 'Validation failed due to an unexpected error' });
  }
};
