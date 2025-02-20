import db from '../src/config/database';

export async function cleanDatabase() {
    try {
        // First, drop all tables with CASCADE to handle dependencies
        await db.query(`
            DROP TABLE IF EXISTS study_sessions CASCADE;
            DROP TABLE IF EXISTS study_activities CASCADE;
            DROP TABLE IF EXISTS words CASCADE;
            DROP TABLE IF EXISTS groups CASCADE;
        `);

        // Then recreate the tables
        await db.query(`
            CREATE TABLE groups (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );

            CREATE TABLE words (
                id SERIAL PRIMARY KEY,
                german VARCHAR(255) NOT NULL,
                phonetic VARCHAR(255),
                english VARCHAR(255) NOT NULL,
                parts JSONB
            );

            CREATE TABLE study_activities (
                id SERIAL PRIMARY KEY,
                group_id INTEGER REFERENCES groups(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE study_sessions (
                id SERIAL PRIMARY KEY,
                group_id INTEGER REFERENCES groups(id),
                study_activity_id INTEGER REFERENCES study_activities(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database cleaned and tables recreated successfully');
    } catch (error) {
        console.error('Error cleaning database:', error);
        throw error;
    }
}

// Run cleanup before tests
cleanDatabase().catch(console.error);
