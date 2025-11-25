import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { requestLogger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { config } from './config/env';

// Import routes
import authRoutes from './routes/auth.routes';
import stocksRoutes from './routes/stocks.routes';
import ordersRoutes from './routes/orders.routes';
import portfolioRoutes from './routes/portfolio.routes';
import indicesRoutes from './routes/indices.routes';

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stocks', stocksRoutes);
app.use('/api/v1/indices', indicesRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);

// Swagger documentation
try {
    const swaggerDocument = YAML.load(
        path.join(__dirname, 'docs', 'swagger.yml')
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.warn('⚠️  Swagger documentation not available');
}

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
