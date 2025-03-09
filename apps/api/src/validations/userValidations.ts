import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.number().positive('Age must be positive'),
});

export function validateUser(req: Request, res: Response, next: NextFunction) {
    try {
        userSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            next(error);
        }
    }
}
