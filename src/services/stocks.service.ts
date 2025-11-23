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
 * Generate mock price history for a stock
 */
const generatePriceHistory = (
    currentPrice: number,
    days: number = 30
): PricePoint[] => {
    const history: PricePoint[] = [];
    const today = new Date();

    // Start from a price slightly different from current
    let price = currentPrice * (0.85 + Math.random() * 0.15);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        history.push({
            date: date.toISOString().split('T')[0],
            price: parseFloat(price.toFixed(2)),
        });

        // Random walk with slight upward bias to reach current price
        const change = (Math.random() - 0.45) * (price * 0.03);
        price = Math.max(price + change, currentPrice * 0.5);
    }

    // Ensure last price is close to current price
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
