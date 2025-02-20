import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import pool from './database';
import seedDatabase from './seed';

export async function initializeDatabase() {
    const client = await pool.connect();
    
    try {
        // Check if tables exist
        const { rows: existingTables } = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `);

        const requiredTables = ['words', 'groups', 'words_groups', 'study_sessions', 'study_activities', 'word_review_items'];
        const existingTableNames = existingTables.map(t => t.table_name);
        const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));

        if (missingTables.length > 0) {
            console.log('Missing tables detected:', missingTables);
            console.log('Initializing database schema...');

            // Read and execute init.sql
            const initSqlPath = path.join(__dirname, 'init.sql');
            const initSql = fs.readFileSync(initSqlPath, 'utf8');
            await client.query(initSql);
            console.log('Database schema initialized successfully');
        } else {
            console.log('All required tables exist');
        }

        // Check if tables are empty
        const tablesEmpty = await Promise.all(
            requiredTables.map(async (table) => {
                const { rows } = await client.query(`SELECT COUNT(*) FROM ${table}`);
                return { table, isEmpty: parseInt(rows[0].count) === 0 };
            })
        );

        const emptyTables = tablesEmpty.filter(t => t.isEmpty).map(t => t.table);
        
        if (emptyTables.length > 0) {
            console.log('Empty tables detected:', emptyTables);
            console.log('Seeding database...');
            await seedDatabase();
            console.log('Database seeded successfully');
        } else {
            console.log('All tables contain data');
        }

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Function to check if all required tables are empty
export async function isDatabaseEmpty(): Promise<boolean> {
    const client = await pool.connect();
    try {
        const tables = ['words', 'groups', 'words_groups', 'study_sessions', 'study_activities', 'word_review_items'];
        
        for (const table of tables) {
            const { rows } = await client.query(`SELECT COUNT(*) FROM ${table}`);
            if (parseInt(rows[0].count) > 0) {
                return false;
            }
        }
        return true;
    } finally {
        client.release();
    }
}

// Export a function that can be used to reset the database (useful for testing)
export async function resetDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Drop all tables
        await client.query(`
            DROP TABLE IF EXISTS 
                word_review_items,
                study_activities,
                study_sessions,
                words_groups,
                words,
                groups
            CASCADE;
        `);

        // Reinitialize and seed
        await initializeDatabase();
        
        await client.query('COMMIT');
        console.log('Database reset successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error resetting database:', error);
        throw error;
    } finally {
        client.release();
    }
}
