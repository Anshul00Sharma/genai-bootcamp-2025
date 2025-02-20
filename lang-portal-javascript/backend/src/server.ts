import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import pool, { testConnection } from './config/database';
import { initializeDatabase } from './config/initializeDatabase';

// Import routes
import dashboardRoutes from './routes/dashboard.routes';
import groupsRoutes from './routes/groups.routes';
import studyActivitiesRoutes from './routes/study-activities.routes';
import studySessionsRoutes from './routes/study-sessions.routes';
import wordsRoutes from './routes/words.routes';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/study_activities', studyActivitiesRoutes);
app.use('/api/study_sessions', studySessionsRoutes);
app.use('/api/words', wordsRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        await testConnection();
        console.log('Database connection successful');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Initialize database
initializeDatabase();

// Export app for testing
export { app };

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    startServer();
}