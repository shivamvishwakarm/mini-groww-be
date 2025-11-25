import { Stock, IStock } from '../models/Stock.model';
import { getCache, setCache } from '../config/redis';

// Cache TTLs (in seconds)
const CACHE_TTL = {
    STOCKS_LIST: 60,
    STOCK_DETAIL: 60,
    STOCK_HISTORY: 300,
};

// Cache key patterns
const CACHE_KEYS = {
    STOCKS_LIST: 'stocks:list',
    STOCK_DETAIL: (symbol: string) => `stocks:detail:${symbol}`,
    STOCK_HISTORY: (symbol: string) => `stocks:history:${symbol}`,
};

export interface PricePoint {
    date: string;
    price: number;
}

/**
 * Get all stocks with Redis caching
 */
export const getAllStocks = async (): Promise<IStock[]> => {
    // Try to get from cache
    const cached = await getCache<IStock[]>(CACHE_KEYS.STOCKS_LIST);
    if (cached) {
        return cached;
    }

    // Get from database
    const stocks = await Stock.find().sort({ symbol: 1 });

    // Cache the result
    await setCache(CACHE_KEYS.STOCKS_LIST, stocks, CACHE_TTL.STOCKS_LIST);

    return stocks;
};

/**
 * Get stock by symbol with Redis caching
 */
export const getStockBySymbol = async (
    symbol: string
): Promise<IStock | null> => {
    const upperSymbol = symbol.toUpperCase();

    // Try to get from cache
    const cacheKey = CACHE_KEYS.STOCK_DETAIL(upperSymbol);
    const cached = await getCache<IStock>(cacheKey);
    if (cached) {
        return cached;
    }

    // Get from database
    const stock = await Stock.findOne({ symbol: upperSymbol });

    if (stock) {
        // Cache the result
        await setCache(cacheKey, stock, CACHE_TTL.STOCK_DETAIL);
    }

    return stock;
};

/**
 * Generate mock intraday price history for a stock (one day, hourly intervals)
 */
const generatePriceHistory = (
    currentPrice: number,
    hours: number = 24
): PricePoint[] => {
    const history: PricePoint[] = [];
    const now = new Date();

    // Start from a price slightly different from current (previous day's close)
    let price = currentPrice * (0.95 + Math.random() * 0.05);

    for (let i = hours - 1; i >= 0; i--) {
        const timestamp = new Date(now);
        timestamp.setHours(timestamp.getHours() - i);

        history.push({
            date: timestamp.toISOString(),
            price: parseFloat(price.toFixed(2)),
        });

        // Random walk with slight bias to reach current price
        const change = (Math.random() - 0.48) * (price * 0.01);
        price = Math.max(price + change, currentPrice * 0.8);
    }

    // Ensure last price is the current price
    history[history.length - 1].price = currentPrice;

    return history;
};

/**
 * Get stock price history with Redis caching
 */
export const getStockHistory = async (
    symbol: string
): Promise<PricePoint[]> => {
    const upperSymbol = symbol.toUpperCase();

    // Try to get from cache
    const cacheKey = CACHE_KEYS.STOCK_HISTORY(upperSymbol);
    const cached = await getCache<PricePoint[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Get stock from database
    const stock = await Stock.findOne({ symbol: upperSymbol });
    if (!stock) {
        throw new Error('Stock not found');
    }

    // Generate mock history
    const history = generatePriceHistory(stock.currentPrice);

    // Cache the result
    await setCache(cacheKey, history, CACHE_TTL.STOCK_HISTORY);

    return history;
};
