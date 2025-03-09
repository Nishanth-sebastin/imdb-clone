import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const movieSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    releaseYear: z.number().min(1900, 'Invalid year').max(new Date().getFullYear(), 'Future year not allowed'),
});

export function validateMovie(req: Request, res: Response, next: NextFunction) {
    try {
        movieSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            next(error);
        }
    }
}
