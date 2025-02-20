import { z } from 'zod';

const PaginationSchema = z.object({
  current_page: z.number().int().positive(),
  total_pages: z.number().int().min(0),
  total_items: z.number().int().min(0),
  items_per_page: z.number().int().positive()
});

export const WordListItemSchema = z.object({
  german: z.string().min(1),
  phonetics: z.string(),
  english: z.string().min(1),
  correct_count: z.number().int().min(0),
  wrong_count: z.number().int().min(0)
});

export const WordListResponseSchema = z.object({
  items: z.array(WordListItemSchema),
  pagination: PaginationSchema
});

export const WordGroupSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1)
});

export const WordDetailsSchema = z.object({
  german: z.string().min(1),
  phonetics: z.string(),
  english: z.string().min(1),
  stats: z.object({
    correct_count: z.number().int().min(0),
    wrong_count: z.number().int().min(0)
  }),
  groups: z.array(WordGroupSchema)
});

export const ErrorResponseSchema = z.object({
  error: z.string()
});
