import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env file
config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
    throw new Error('Missing required database environment variables');
}

// Create a new Pool instance
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
export async function testConnection(): Promise<void> {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT version()');
        console.log('Database connection successful:', result.rows[0]);
    } finally {
        client.release();
    }
}

// Export pool for use in other files
export default pool;