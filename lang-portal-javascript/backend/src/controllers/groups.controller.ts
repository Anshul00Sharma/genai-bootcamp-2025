import type { Request, Response } from 'express';
import { validateResponse } from '../schemas/validateResponse';
import {
  GroupListResponseSchema,
  GroupDetailsSchema,
  GroupWordsResponseSchema,
  GroupStudySessionsResponseSchema,
  ErrorResponseSchema
} from '../schemas/groups.schema';
import pool from '../config/database';

export const getGroups = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(_req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(_req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    try {
      // Query to get groups with word count
      const query = `
        SELECT g.id, g.name, COUNT(wg.word_id) as word_count
        FROM groups g
        LEFT JOIN words_groups wg ON g.id = wg.group_id
        GROUP BY g.id, g.name
        ORDER BY g.name ASC
        LIMIT $1 OFFSET $2
      `;

      // Query to get total count of groups
      const [groups, count] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query('SELECT COUNT(*) FROM groups')
      ]);

      const total = parseInt(count.rows[0].count);
      const response = {
        items: groups.rows.map(group => ({
          id: group.id,
          name: group.name,
          word_count: parseInt(group.word_count)
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
          error: 'Database table not found. Please ensure the groups table exists.'
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
    console.error('Error in getGroups:', error);
    res.status(500).json({
      error: 'An error occurred while fetching groups'
    });
  }
};

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // Query to get group details with word count
    const query = `
      SELECT g.id, g.name, COUNT(wg.word_id) as total_word_count
      FROM groups g
      LEFT JOIN words_groups wg ON g.id = wg.group_id
      WHERE g.id = $1
      GROUP BY g.id, g.name
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const group = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      stats: {
        total_word_count: parseInt(result.rows[0].total_word_count)
      }
    };

    res.json(group);
  } catch (dbError: any) {
    // Handle specific database errors
    if (dbError.code === '42P01') {
      res.status(500).json({
        error: 'Database table not found. Please ensure the groups table exists.'
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

    console.error('Error in getGroupById:', dbError);
    res.status(500).json({
      error: 'An error occurred while fetching the group'
    });
  }
};

export const getGroupWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    // First check if group exists
    const groupCheck = await pool.query(
      'SELECT id FROM groups WHERE id = $1',
      [id]
    );

    if (groupCheck.rows.length === 0) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    try {
      // Query to get words for the group with pagination
      const query = `
        SELECT w.german, w.phonetic, w.english, w.parts
        FROM words w
        JOIN words_groups wg ON w.id = wg.word_id
        WHERE wg.group_id = $1
        ORDER BY w.german ASC
        LIMIT $2 OFFSET $3
      `;

      // Get total count of words in the group
      const [words, count] = await Promise.all([
        pool.query(query, [id, limit, offset]),
        pool.query(
          'SELECT COUNT(*) FROM words w JOIN words_groups wg ON w.id = wg.word_id WHERE wg.group_id = $1',
          [id]
        )
      ]);

      const total = parseInt(count.rows[0].count);
      const response = {
        items: words.rows.map(word => ({
          german: word.german,
          phonetics: word.phonetic,
          english: word.english,
          parts: typeof word.parts === 'string' ? JSON.parse(word.parts) : word.parts
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
    console.error('Error in getGroupWords:', error);
    res.status(500).json({
      error: 'An error occurred while fetching group words'
    });
  }
};

export const getGroupStudySessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    // First check if group exists
    const groupCheck = await pool.query(
      'SELECT id FROM groups WHERE id = $1',
      [id]
    );

    if (groupCheck.rows.length === 0) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

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
        WHERE ss.group_id = $1
        GROUP BY ss.id, sa.id, g.name, ss.created_at
        ORDER BY ss.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      // Get total count of study sessions for the group
      const [sessions, count] = await Promise.all([
        pool.query(query, [id, limit, offset]),
        pool.query(
          'SELECT COUNT(DISTINCT ss.id) FROM study_sessions ss WHERE ss.group_id = $1',
          [id]
        )
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
    console.error('Error in getGroupStudySessions:', error);
    res.status(500).json({
      error: 'An error occurred while fetching group study sessions'
    });
  }
};
