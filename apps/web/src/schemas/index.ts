import { z } from 'zod';

export const movieValidationSchema = z.object({
  title: z.string(),
  year: z.preprocess((val) => Number(val), z.number()),
  description: z.string(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  cast: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        role: z.enum(['actor', 'producer']), // 👈 Only "actor" or "producer"
        imageUrl: z.string().optional(),
      })
    )
    .superRefine((cast, ctx) => {
      const producers = cast.filter((member) => member.role === 'producer');
      if (producers.length !== 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'A movie must have exactly one producer.',
          path: ['cast'],
        });
      }
    }),
});
// Define validation schema for registration
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Define validation schema for login
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});
