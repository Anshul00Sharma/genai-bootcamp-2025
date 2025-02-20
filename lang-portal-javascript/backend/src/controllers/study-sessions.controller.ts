import type { Request, Response } from 'express';
import { validateResponse } from '../schemas/validateResponse';
import {
  StudySessionsResponseSchema,
  StudySessionSchema,
  StudySessionWordsResponseSchema,
  WordReviewRequestSchema,
  WordReviewResponseSchema,
  ErrorResponseSchema
} from '../schemas/study-sessions.schema';
import pool from '../config/database';

export const getStudySessions = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(_req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(_req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    try {
      // Query to get study sessions with activity details and word review counts
      const query = `
        SELECT 
          ss.id,
          sa.id as activity_id,
          g.name as group_name,
          ss.created_at as start_time,
          COUNT(wri.id) as review_items_count
        FROM study_sessions ss
        JOIN groups g ON ss.group_id = g.id
        LEFT JOIN study_activities sa ON ss.study_activity_id = sa.id
        LEFT JOIN word_review_items wri ON ss.id = wri.study_session_id
        GROUP BY ss.id, sa.id, g.name, ss.created_at
        ORDER BY ss.created_at DESC
        LIMIT $1 OFFSET $2
      `;

      // Get total count of study sessions
      const [sessions, count] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query('SELECT COUNT(DISTINCT id) FROM study_sessions')
      ]);

      const total = parseInt(count.rows[0].count);
      const response = {
        items: sessions.rows.map(session => ({
          id: session.id,
          activity_name: "Vocabulary Practice", // Default activity name since it's not stored in DB
          group_name: session.group_name,
          start_time: session.start_time.toISOString(),
          end_time: session.start_time ? new Date(new Date(session.start_time).getTime() + 30 * 60000).toISOString() : null, // Assuming 30 min sessions
          review_items_count: parseInt(session.review_items_count)
        })),
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      };

      res.json(response);
    } catch (dbError: any) {
      // Handle specific database errors
      if (dbError.code === '42P01') {
        res.status(500).json({
          error: 'Database table not found. Please ensure the required tables exist.'
        });
        return;
      }
      
      if (dbError.code === '42703') {
        console.error('Column error:', dbError.message);
        res.status(500).json({
          error: 'Database schema mismatch. Please check the database structure.'
        });
        return;
      }

      if (dbError.code === '08006' || dbError.code === '08001') {
        res.status(503).json({
          error: 'Database connection failed. Please try again later.'
        });
        return;
      }

      throw dbError; // Re-throw for generic error handling
    }
  } catch (error) {
    console.error('Error in getStudySessions:', error);
    res.status(500).json({
      error: 'An error occurred while fetching study sessions'
    });
  }
};

export const getStudySessionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // Query to get study session details with activity and review counts
    const query = `
      SELECT 
        ss.id,
        sa.id as activity_id,
        g.name as group_name,
        ss.created_at as start_time,
        COUNT(wri.id) as review_items_count
      FROM study_sessions ss
      JOIN groups g ON ss.group_id = g.id
      LEFT JOIN study_activities sa ON ss.study_activity_id = sa.id
      LEFT JOIN word_review_items wri ON ss.id = wri.study_session_id
      WHERE ss.id = $1
      GROUP BY ss.id, sa.id, g.name, ss.created_at
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Study session not found' });
      return;
    }

    const session = {
      id: result.rows[0].id,
      activity_name: "Vocabulary Practice", // Default activity name
      group_name: result.rows[0].group_name,
      start_time: result.rows[0].start_time.toISOString(),
      end_time: result.rows[0].start_time ? 
        new Date(new Date(result.rows[0].start_time).getTime() + 30 * 60000).toISOString() : null, // 30 min session
      review_items_count: parseInt(result.rows[0].review_items_count)
    };

    res.json(session);
  } catch (dbError: any) {
    // Handle specific database errors
    if (dbError.code === '42P01') {
      res.status(500).json({
        error: 'Database table not found. Please ensure the required tables exist.'
      });
      return;
    }
    
    if (dbError.code === '42703') {
      console.error('Column error:', dbError.message);
      res.status(500).json({
        error: 'Database schema mismatch. Please check the database structure.'
      });
      return;
    }

    if (dbError.code === '08006' || dbError.code === '08001') {
      res.status(503).json({
        error: 'Database connection failed. Please try again later.'
      });
      return;
    }

    console.error('Error in getStudySessionById:', dbError);
    res.status(500).json({
      error: 'An error occurred while fetching the study session'
    });
  }
};

export const getStudySessionWords = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    // First check if study session exists
    const sessionCheck = await pool.query(
      'SELECT id FROM study_sessions WHERE id = $1',
      [id]
    );

    if (sessionCheck.rows.length === 0) {
      res.status(404).json({ error: 'Study session not found' });
      return;
    }

    try {
      // Query to get words reviewed in this study session with their details
      const query = `
        SELECT DISTINCT 
          w.german,
          w.phonetic,
          w.english,
          w.parts,
          COUNT(CASE WHEN wri.correct = true THEN 1 END) as correct_count,
          COUNT(CASE WHEN wri.correct = false THEN 1 END) as wrong_count
        FROM words w
        JOIN word_review_items wri ON wri.word_id = w.id
        WHERE wri.study_session_id = $1
        GROUP BY w.id, w.german, w.phonetic, w.english, w.parts
        ORDER BY w.german ASC
        LIMIT $2 OFFSET $3
      `;

      // Get total count of words in this study session
      const [words, count] = await Promise.all([
        pool.query(query, [id, limit, offset]),
        pool.query(
          'SELECT COUNT(DISTINCT w.id) FROM words w JOIN word_review_items wri ON wri.word_id = w.id WHERE wri.study_session_id = $1',
          [id]
        )
      ]);

      const total = parseInt(count.rows[0].count);
      const response = {
        items: words.rows.map(word => ({
          german: word.german,
          phonetics: word.phonetic,
          english: word.english,
          parts: typeof word.parts === 'string' ? JSON.parse(word.parts) : word.parts,
          correct_count: parseInt(word.correct_count),
          wrong_count: parseInt(word.wrong_count)
        })),
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      };

      res.json(response);
    } catch (dbError: any) {
      // Handle specific database errors
      if (dbError.code === '42P01') {
        res.status(500).json({
          error: 'Database table not found. Please ensure the required tables exist.'
        });
        return;
      }
      
      if (dbError.code === '42703') {
        console.error('Column error:', dbError.message);
        res.status(500).json({
          error: 'Database schema mismatch. Please check the database structure.'
        });
        return;
      }

      if (dbError.code === '08006' || dbError.code === '08001') {
        res.status(503).json({
          error: 'Database connection failed. Please try again later.'
        });
        return;
      }

      throw dbError; // Re-throw for generic error handling
    }
  } catch (error) {
    console.error('Error in getStudySessionWords:', error);
    res.status(500).json({
      error: 'An error occurred while fetching study session words'
    });
  }
};

export const reviewWord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, word_id } = req.params;
    const { correct } = req.body;
    
    // Validate request body
    WordReviewRequestSchema.parse({ correct });
    
    // First check if study session exists
    const sessionCheck = await pool.query(
      'SELECT id FROM study_sessions WHERE id = $1',
      [id]
    );

    if (sessionCheck.rows.length === 0) {
      res.status(404).json({ error: 'Study session not found' });
      return;
    }

    // Check if word exists
    const wordCheck = await pool.query(
      'SELECT id FROM words WHERE id = $1',
      [word_id]
    );

    if (wordCheck.rows.length === 0) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }

    try {
      // Create word review item
      const now = new Date();
      const query = `
        INSERT INTO word_review_items (
          word_id,
          study_session_id,
          correct,
          created_at
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, word_id, study_session_id, correct, created_at
      `;

      const result = await pool.query(query, [
        word_id,
        id,
        correct,
        now
      ]);

      const review = {
        success: true,
        word_id: parseInt(word_id),
        study_session_id: parseInt(id),
        correct: result.rows[0].correct,
        created_at: result.rows[0].created_at.toISOString()
      };

      res.status(201).json(review);
    } catch (dbError: any) {
      // Handle specific database errors
      if (dbError.code === '42P01') {
        res.status(500).json({
          error: 'Database table not found. Please ensure the word_review_items table exists.'
        });
        return;
      }
      
      if (dbError.code === '42703') {
        console.error('Column error:', dbError.message);
        res.status(500).json({
          error: 'Database schema mismatch. Please check the database structure.'
        });
        return;
      }

      if (dbError.code === '23503') { // Foreign key violation
        res.status(400).json({
          error: 'Invalid word_id or study_session_id provided.'
        });
        return;
      }

      if (dbError.code === '08006' || dbError.code === '08001') {
        res.status(503).json({
          error: 'Database connection failed. Please try again later.'
        });
        return;
      }

      throw dbError; // Re-throw for generic error handling
    }
  } catch (error) {
    console.error('Error in reviewWord:', error);
    res.status(500).json({
      error: 'An error occurred while creating the word review'
    });
  }
};
