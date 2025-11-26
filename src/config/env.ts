import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define environment schema
const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
    REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    INITIAL_BALANCE: z.string().default('100000'),
    CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:4173,https://groww.shivam09.tech,https://mini-groww-fe.vercel.app,https://mini-groww-fe-git-main-shivamvishwakarms-projects.vercel.app'),
});

// Validate and parse environment variables
const parseEnv = () => {
    try {
        const parsed = envSchema.parse(process.env);
        return {
            port: parseInt(parsed.PORT, 10),
            nodeEnv: parsed.NODE_ENV,
            mongoUri: parsed.MONGO_URI,
            redisUrl: parsed.REDIS_URL,
            jwtSecret: parsed.JWT_SECRET,
            jwtExpiresIn: parsed.JWT_EXPIRES_IN,
            initialBalance: parseFloat(parsed.INITIAL_BALANCE),
            corsOrigin: parsed.CORS_ORIGIN,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

export const config = parseEnv();
