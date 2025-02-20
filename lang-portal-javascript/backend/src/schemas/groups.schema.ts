import { z } from 'zod';

const PaginationSchema = z.object({
  current_page: z.number().int().positive(),
  total_pages: z.number().int().min(0),
  total_items: z.number().int().min(0),
  items_per_page: z.number().int().positive()
});

export const GroupListItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  word_count: z.number().int().min(0)
});

export const GroupListResponseSchema = z.object({
  items: z.array(GroupListItemSchema),
  pagination: PaginationSchema
});

export const GroupDetailsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  stats: z.object({
    total_word_count: z.number().int().min(0)
  })
});

export const GroupWordSchema = z.object({
  german: z.string().min(1),
  phonetics: z.string(),
  english: z.string().min(1),
  correct_count: z.number().int().min(0),
  wrong_count: z.number().int().min(0)
});

export const GroupWordsResponseSchema = z.object({
  items: z.array(GroupWordSchema),
  pagination: PaginationSchema
});

export const GroupStudySessionSchema = z.object({
  id: z.number().int().positive(),
  activity_name: z.string().min(1),
  group_name: z.string().min(1),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  review_items_count: z.number().int().min(0)
});

export const GroupStudySessionsResponseSchema = z.object({
  items: z.array(GroupStudySessionSchema),
  pagination: PaginationSchema
});

export const ErrorResponseSchema = z.object({
  error: z.string()
});
