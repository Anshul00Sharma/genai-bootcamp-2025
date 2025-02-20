import { z } from 'zod';

export const SystemResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

export const ErrorResponseSchema = z.object({
  error: z.string()
});
