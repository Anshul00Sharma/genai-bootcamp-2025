import type { Response } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateResponse<T>(res: Response, schema: ZodSchema, data: T): void {
  try {
    schema.parse(data);
    res.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Response validation error:', error.errors);
      res.status(500).json({
        error: 'Server response validation failed',
        details: error.errors
      });
    } else {
      console.error('Unexpected error during response validation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
