import type { Request, Response } from 'express';
import { validateResponse } from '../schemas/validateResponse';
import {
  StudyActivitySchema,
  StudySessionsResponseSchema,
  ErrorResponseSchema,
  CreateStudyActivityRequestSchema,
  CreateStudyActivityResponseSchema
} from '../schemas/study-activities.schema';
import pool from '../config/database';

export const getStudyActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Implement logic to fetch study activity by id
    const activity = {
      id: parseInt(id),
      name: "Vocabulary Quiz",
      thumbnail_url: "https://example.com/thumbnail.jpg",
      description: "Practice your vocabulary with flashcards"
    };
    validateResponse(res, StudyActivitySchema, activity);
  } catch (error) {
    validateResponse(res, ErrorResponseSchema, { error: 'Failed to fetch study activity' });
  }
};

export const getStudyActivitySessions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Implement logic to fetch study sessions for activity
    const now = new Date();
    const endTime = new Date(now.getTime() + 10 * 60000); // 10 minutes later
    const response = {
      items: [
        {
          id: 123,
          activity_name: "Vocabulary Quiz",
          group_name: "Basic Greetings",
          start_time: now.toISOString(),
          end_time: endTime.toISOString(),
          review_items_count: 20
        }
      ],
      pagination: {
        current_page: 1,
        total_pages: 5,
        total_items: 100,
        items_per_page: 20
      }
    };
    validateResponse(res, StudySessionsResponseSchema, response);
  } catch (error) {
    validateResponse(res, ErrorResponseSchema, { error: 'Failed to fetch study sessions' });
  }
};

export const createStudyActivity = async (req: Request, res: Response) => {
  try {
    const payload = CreateStudyActivityRequestSchema.parse(req.body);
    // TODO: Implement logic to create study activity
    const newActivity = {
      id: 124,
      group_id: payload.group_id
    };
    res.status(201)
    validateResponse(res, CreateStudyActivityResponseSchema, newActivity);
  } catch (error) {
    validateResponse(res, ErrorResponseSchema, { error: 'Failed to create study activity' });
  }
};
