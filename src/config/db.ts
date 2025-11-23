import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
    logger.error('❌ MongoDB error:', error);
});
