import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err: any) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }

    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Validation failed due to an unexpected error';

    res.status(500).json({ message: errorMessage });
  }
};
