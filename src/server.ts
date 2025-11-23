import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { redis } from './config/redis';
import { logger } from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Test Redis connection
        await redis.ping();

        // Start Express server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Server running on port ${config.port}`);
            logger.info(`📚 API Docs: http://localhost:${config.port}/api-docs`);
            logger.info(`🏥 Health Check: http://localhost:${config.port}/health`);
            logger.info(`🌍 Environment: ${config.nodeEnv}`);
        });

        // Graceful shutdown
        const gracefulShutdown = async () => {
            logger.info('Shutting down gracefully...');
            server.close(async () => {
                await redis.quit();
                process.exit(0);
            });
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
