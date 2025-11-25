import { Stock } from '../models/Stock.model';
import { Index } from '../models/Index.model';
import { redis } from '../config/redis';
import { socketService } from './socket.service';
import { logger } from '../utils/logger';

const SIMULATION_INTERVAL = 2000; // 2 seconds
const MAX_HISTORY_LENGTH = 100;

export class MarketService {
    private static instance: MarketService;
    private isRunning: boolean = false;
    private intervalId: NodeJS.Timeout | null = null;

    // Stocks to simulate
    private readonly targetStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

    // Indices to simulate
    private readonly targetIndices = ['NIFTY', 'SENSEX', 'BANKNIFTY', 'MIDCAPNIFTY', 'FINNIFTY'];

    private constructor() { }

    public static getInstance(): MarketService {
        if (!MarketService.instance) {
            MarketService.instance = new MarketService();
        }
        return MarketService.instance;
    }

    public async startSimulation(): Promise<void> {
        if (this.isRunning) {
            logger.warn('⚠️  Market simulation already running');
            return;
        }

        this.isRunning = true;
        logger.info('🚀 Market simulation started');

        // Ensure stocks exist (optional, but good for safety)
        await this.ensureStocksExist();

        this.intervalId = setInterval(async () => {
            await this.updatePrices();
            await this.updateIndices();
        }, SIMULATION_INTERVAL);
    }

    public stopSimulation(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        logger.info('🛑 Market simulation stopped');
    }

    private async ensureStocksExist(): Promise<void> {
        // This is a placeholder. In a real app, you'd seed these or check DB.
        // For now, we assume the seed script has run or we just update what's there.
    }

    private async updatePrices(): Promise<void> {
        try {
            for (const symbol of this.targetStocks) {
                const stock = await Stock.findOne({ symbol });
                if (!stock) continue;

                // Fluctuate price by +/- 2%
                const changePercent = (Math.random() - 0.5) * 0.04;
                const newPrice = stock.currentPrice * (1 + changePercent);

                // Update DB
                stock.currentPrice = parseFloat(newPrice.toFixed(2));
                await stock.save();

                // Update Redis Current Price
                await redis.set(`stock:price:${symbol}`, stock.currentPrice.toString());

                // Update Redis History
                const historyEntry = JSON.stringify({
                    price: stock.currentPrice,
                    timestamp: new Date().toISOString(),
                });
                await redis.lpush(`stock:history:${symbol}`, historyEntry);
                await redis.ltrim(`stock:history:${symbol}`, 0, MAX_HISTORY_LENGTH - 1);

                // Broadcast update to subscribers of this symbol
                socketService.broadcastToSymbol(symbol, {
                    symbol: stock.symbol,
                    price: stock.currentPrice,
                    changePercent: changePercent * 100,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
            logger.error('❌ Error in market simulation:', error);
        }
    }

    private async updateIndices(): Promise<void> {
        try {
            for (const symbol of this.targetIndices) {
                const index = await Index.findOne({ symbol });
                if (!index) continue;

                // Fluctuate value by +/- 1% (indices are less volatile)
                const changePercent = (Math.random() - 0.5) * 0.02;
                const newValue = index.currentValue * (1 + changePercent);

                // Update DB
                index.currentValue = parseFloat(newValue.toFixed(2));
                await index.save();

                // Update Redis Current Value
                await redis.set(`index:price:${symbol}`, index.currentValue.toString());

                // Update Redis History
                const historyEntry = JSON.stringify({
                    value: index.currentValue,
                    timestamp: new Date().toISOString(),
                });
                await redis.lpush(`index:history:${symbol}`, historyEntry);
                await redis.ltrim(`index:history:${symbol}`, 0, MAX_HISTORY_LENGTH - 1);

                // Broadcast update to subscribers of this symbol
                socketService.broadcastToSymbol(symbol, {
                    symbol: index.symbol,
                    value: index.currentValue,
                    changePercent: changePercent * 100,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
            logger.error('❌ Error in index simulation:', error);
        }
    }
}

export const marketService = MarketService.getInstance();
