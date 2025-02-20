import { z } from 'zod';

const PaginationSchema = z.object({
  current_page: z.number().int().positive(),
  total_pages: z.number().int().min(0),
  total_items: z.number().int().min(0),
  items_per_page: z.number().int().positive()
});

export const StudySessionSchema = z.object({
  id: z.number().int().positive(),
  activity_name: z.string().min(1),
  group_name: z.string().min(1),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  review_items_count: z.number().int().min(0)
});

export const StudySessionsResponseSchema = z.object({
  items: z.array(StudySessionSchema),
  pagination: PaginationSchema
});

export const StudySessionWordSchema = z.object({
  german: z.string().min(1),
  phonetics: z.string(),
  english: z.string().min(1),
  correct_count: z.number().int().min(0),
  wrong_count: z.number().int().min(0)
});

export const StudySessionWordsResponseSchema = z.object({
  items: z.array(StudySessionWordSchema),
  pagination: PaginationSchema
});

export const WordReviewRequestSchema = z.object({
  correct: z.boolean()
});

export const WordReviewResponseSchema = z.object({
  success: z.boolean(),
  word_id: z.number().int().positive(),
  study_session_id: z.number().int().positive(),
  correct: z.boolean(),
  created_at: z.string().datetime()
});

export const ErrorResponseSchema = z.object({
  error: z.string()
});
