import { z } from 'zod';

export const LastStudySessionSchema = z.object({
  id: z.number(),
  group_id: z.number(),
  created_at: z.string().datetime(),
  study_activity_id: z.number(),
  group_name: z.string()
});

export const StudyProgressSchema = z.object({
  total_words_studied: z.number().int().min(0),
  total_available_words: z.number().int().min(0)
});

export const QuickStatsSchema = z.object({
  success_rate: z.number().min(0).max(100),
  total_study_sessions: z.number().int().min(0),
  total_active_groups: z.number().int().min(0),
  study_streak_days: z.number().int().min(0)
});

export const ErrorResponseSchema = z.object({
  error: z.string()
});
