import type { Request, Response } from 'express';
import { validateResponse } from '../schemas/validateResponse';
import { 
  LastStudySessionSchema,
  StudyProgressSchema,
  QuickStatsSchema,
  ErrorResponseSchema
} from '../schemas/dashboard.schema';

export const getLastStudySession = async (_req: Request, res: Response) => {
  try {
    // Mock response with correct datetime format
    const lastSession = {
      id: 123,
      group_id: 456,
      created_at: new Date().toISOString(),
      study_activity_id: 789,
      group_name: "Basic Greetings"
    };
    validateResponse(res, LastStudySessionSchema, lastSession);
  } catch (error) {
    validateResponse(res, ErrorResponseSchema, { error: 'Failed to fetch last study session' });
  }
};

export const getStudyProgress = async (_req: Request, res: Response) => {
  try {
    // Mock response
    const progress = {
      total_words_studied: 3,
      total_available_words: 124,
    };
    validateResponse(res, StudyProgressSchema, progress);
  } catch (error) {
    validateResponse(res, ErrorResponseSchema, { error: 'Failed to fetch study progress' });
  }
};

export const getQuickStats = async (_req: Request, res: Response) => {
  try {
    // Mock response
    const stats = {
      success_rate: 80.0,
      total_study_sessions: 4,
      total_active_groups: 3,
      study_streak_days: 5
    };
    validateResponse(res, QuickStatsSchema, stats);
  } catch (error) {
    validateResponse(res, ErrorResponseSchema, { error: 'Failed to fetch quick stats' });
  }
};
