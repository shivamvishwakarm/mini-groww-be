import Redis from 'ioredis';
import { config } from './env';
import { logger } from '../utils/logger';

// Create Redis client
export const redis = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

// Handle Redis events
redis.on('connect', () => {
    logger.info('✅ Redis connected');
});

redis.on('error', (error) => {
    logger.error('❌ Redis error:', error);
});

redis.on('close', () => {
    logger.warn('⚠️  Redis connection closed');
});

// Helper function to get cached data
export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error(`Error getting cache for key ${key}:`, error);
        return null;
    }
};

// Helper function to set cached data
export const setCache = async (
    key: string,
    data: unknown,
    ttl: number
): Promise<void> => {
    try {
        await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
        logger.error(`Error setting cache for key ${key}:`, error);
    }
};

// Helper function to delete cached data
export const deleteCache = async (key: string): Promise<void> => {
    try {
        await redis.del(key);
    } catch (error) {
        logger.error(`Error deleting cache for key ${key}:`, error);
    }
};

// Helper function to delete cache by pattern
export const deleteCachePattern = async (pattern: string): Promise<void> => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        logger.error(`Error deleting cache pattern ${pattern}:`, error);
    }
};
