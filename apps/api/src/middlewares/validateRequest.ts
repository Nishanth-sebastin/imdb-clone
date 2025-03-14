import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Handle non-Zod errors
    const message = error instanceof Error ? error.message : 'Validation failed';

    res.status(500).json({ message });
  }
};
