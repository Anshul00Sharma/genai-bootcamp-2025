import { Pool } from 'pg';
import pool from './database';

const seedDatabase = async () => {
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Seed groups
        const groupsData = [
            { name: 'Basic Greetings' },
            { name: 'Numbers' },
            { name: 'Colors' },
            { name: 'Days of the Week' }
        ];

        const groupInsertResults = await Promise.all(
            groupsData.map(group => 
                client.query('INSERT INTO groups (name) VALUES ($1) RETURNING id', [group.name])
            )
        );
        
        const groupIds = groupInsertResults.map(result => result.rows[0].id);

        // Seed words
        const wordsData = [
            { german: 'Hallo', phonetic: 'HA-lo', english: 'hello', parts: { type: 'greeting', usage: 'informal' } },
            { german: 'Guten Morgen', phonetic: 'GU-ten MOR-gen', english: 'good morning', parts: { type: 'greeting', usage: 'formal' } },
            { german: 'Auf Wiedersehen', phonetic: 'auf VI-der-zen', english: 'goodbye', parts: { type: 'farewell', usage: 'formal' } },
            { german: 'Danke', phonetic: 'DAN-ke', english: 'thank you', parts: { type: 'courtesy', usage: 'both' } },
            { german: 'Bitte', phonetic: 'BI-te', english: 'please/you\'re welcome', parts: { type: 'courtesy', usage: 'both' } }
        ];

        const wordInsertResults = await Promise.all(
            wordsData.map(word =>
                client.query(
                    'INSERT INTO words (german, phonetic, english, parts) VALUES ($1, $2, $3, $4) RETURNING id',
                    [word.german, word.phonetic, word.english, JSON.stringify(word.parts)]
                )
            )
        );

        const wordIds = wordInsertResults.map(result => result.rows[0].id);

        // Link words to Basic Greetings group (first group)
        await Promise.all(
            wordIds.map(wordId =>
                client.query(
                    'INSERT INTO words_groups (word_id, group_id) VALUES ($1, $2)',
                    [wordId, groupIds[0]]
                )
            )
        );

        // Create study session first (since study_activities references it)
        const now = new Date();
        const { rows: [studySession] } = await client.query(
            'INSERT INTO study_sessions (group_id, created_at) VALUES ($1, $2) RETURNING id',
            [groupIds[0], now]
        );

        // Create study activity
        const { rows: [studyActivity] } = await client.query(
            'INSERT INTO study_activities (study_session_id, group_id, created_at) VALUES ($1, $2, $3) RETURNING id',
            [studySession.id, groupIds[0], now]
        );

        // Update study session with study_activity_id
        await client.query(
            'UPDATE study_sessions SET study_activity_id = $1 WHERE id = $2',
            [studyActivity.id, studySession.id]
        );

        // Add word review items
        const wordReviews = [
            { correct: true },
            { correct: true },
            { correct: false },
            { correct: true },
            { correct: true }
        ];

        await Promise.all(
            wordReviews.map((review, index) =>
                client.query(
                    'INSERT INTO word_review_items (word_id, study_session_id, correct, created_at) VALUES ($1, $2, $3, $4)',
                    [wordIds[index], studySession.id, review.correct, now]
                )
            )
        );

        // Commit transaction
        await client.query('COMMIT');
        console.log('Database seeded successfully!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        client.release();
    }
};

export default seedDatabase;
