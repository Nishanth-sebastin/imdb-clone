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
