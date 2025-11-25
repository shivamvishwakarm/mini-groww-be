import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { redis } from '../config/redis';

export class SocketService {
    private static instance: SocketService;
    private io: Server | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public init(httpServer: HttpServer): void {
        this.io = new Server(httpServer, {
            cors: {
                origin: config.corsOrigin.split(',').map(origin => origin.trim()),
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info(`🔌 Client connected: ${socket.id}`);

            // Handle subscription to stocks
            socket.on('subscribe', async (data: { symbols: string[] }) => {
                console.log("data", data);
                try {
                    const { symbols } = data;
                    if (!symbols || !Array.isArray(symbols)) {
                        socket.emit('error', { message: 'Invalid symbols array' });
                        return;
                    }

                    // Join rooms for each symbol
                    for (const symbol of symbols) {
                        const upperSymbol = symbol.toUpperCase();
                        socket.join(upperSymbol);
                        logger.info(`📊 Client ${socket.id} subscribed to ${upperSymbol}`);

                        // Send initial price history from Redis
                        const history = await this.getPriceHistory(upperSymbol);
                        socket.emit('priceHistory', {
                            symbol: upperSymbol,
                            history,
                        });
                    }

                    socket.emit('subscribed', { symbols: symbols.map(s => s.toUpperCase()) });
                } catch (error) {
                    logger.error('Error handling subscription:', error);
                    socket.emit('error', { message: 'Failed to subscribe' });
                }
            });

            // Handle unsubscription
            socket.on('unsubscribe', (data: { symbols: string[] }) => {
                try {
                    const { symbols } = data;
                    if (!symbols || !Array.isArray(symbols)) {
                        return;
                    }

                    for (const symbol of symbols) {
                        const upperSymbol = symbol.toUpperCase();
                        socket.leave(upperSymbol);
                        logger.info(`📊 Client ${socket.id} unsubscribed from ${upperSymbol}`);
                    }

                    socket.emit('unsubscribed', { symbols: symbols.map(s => s.toUpperCase()) });
                } catch (error) {
                    logger.error('Error handling unsubscription:', error);
                }
            });

            socket.on('disconnect', () => {
                logger.info(`🔌 Client disconnected: ${socket.id}`);
            });
        });

        logger.info('Socket.io initialized');
    }

    /**
     * Get price history for a symbol from Redis
     */
    private async getPriceHistory(symbol: string): Promise<any[]> {
        try {
            const historyKey = `stock:history:${symbol}`;
            const historyData = await redis.lrange(historyKey, 0, -1);

            // Parse the JSON strings back to objects
            return historyData.map(item => JSON.parse(item));
        } catch (error) {
            logger.error(`Error getting price history for ${symbol}:`, error);
            return [];
        }
    }

    /**
     * Broadcast price update to subscribers of a specific symbol
     */
    public broadcastToSymbol(symbol: string, data: any): void {
        if (this.io) {
            this.io.to(symbol).emit('priceUpdate', data);
        } else {
            logger.warn('⚠️  Socket.io not initialized, cannot broadcast');
        }
    }

    /**
     * Broadcast to all clients (deprecated, use broadcastToSymbol)
     */
    public broadcast(event: string, data: any): void {
        if (this.io) {
            this.io.emit(event, data);
        } else {
            logger.warn('⚠️  Socket.io not initialized, cannot broadcast');
        }
    }
}

export const socketService = SocketService.getInstance();
