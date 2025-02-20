import type { Request, Response } from 'express';
import pool from '../config/database';

export const getWords = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(_req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(_req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    // Extract optional group filter
    const groupId = _req.query.groupId ? parseInt(_req.query.groupId as string) : null;

    try {
      let wordsQuery = `
        SELECT w.id, w.german, w.phonetic, w.english, w.parts,
               array_agg(DISTINCT g.name) as groups
        FROM words w
        LEFT JOIN words_groups wg ON w.id = wg.word_id
        LEFT JOIN groups g ON wg.group_id = g.id
      `;

      const queryParams: any[] = [];
      if (groupId) {
        wordsQuery += ' WHERE wg.group_id = $1';
        queryParams.push(groupId);
      }

      wordsQuery += ' GROUP BY w.id ORDER BY w.german ASC';
      
      // Add pagination
      wordsQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);

      // Execute queries in parallel for better performance
      const [words, count] = await Promise.all([
        pool.query(wordsQuery, queryParams),
        pool.query(
          groupId 
            ? 'SELECT COUNT(DISTINCT w.id) FROM words w JOIN words_groups wg ON w.id = wg.word_id WHERE wg.group_id = $1'
            : 'SELECT COUNT(*) FROM words',
          groupId ? [groupId] : []
        )
      ]);

      const total = parseInt(count.rows[0].count);
      const response = {
        items: words.rows.map(row => ({
          id: row.id,
          german: row.german,
          phonetics: row.phonetic,
          english: row.english,
          parts: typeof row.parts === 'string' ? JSON.parse(row.parts) : row.parts,
          groups: row.groups.filter(Boolean)
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
    console.error('Error in getWords:', error);
    res.status(500).json({
      error: 'An error occurred while fetching words'
    });
  }
};

export const getWordById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const word = await pool.query(
      'SELECT german, phonetic, english FROM words WHERE id = $1',
      [id]
    );

    if (word.rows.length === 0) {
      res.status(404).json({
        error: 'Word not found'
      });
      return;
    }

    res.json(word.rows[0]);
  } catch (dbError: any) {
    // Handle specific database errors
    if (dbError.code === '42P01') {
      res.status(500).json({
        error: 'Database table not found. Please ensure the words table exists.'
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
};
