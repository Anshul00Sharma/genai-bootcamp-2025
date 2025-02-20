import { z } from 'zod';

const PaginationSchema = z.object({
  current_page: z.number().int().positive(),
  total_pages: z.number().int().min(0),
  total_items: z.number().int().min(0),
  items_per_page: z.number().int().positive()
});

export const StudyActivitySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  thumbnail_url: z.string().url(),
  description: z.string()
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

export const ErrorResponseSchema = z.object({
  error: z.string()
});

export const CreateStudyActivityRequestSchema = z.object({
  group_id: z.number().int().positive(),
  study_activity_id: z.number().int().positive()
});

export const CreateStudyActivityResponseSchema = z.object({
  id: z.number().int().positive(),
  group_id: z.number().int().positive()
});
