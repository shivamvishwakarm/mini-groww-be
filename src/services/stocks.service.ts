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

export interface MostBoughtStock {
    symbol: string;
    name: string;
    currentPrice: number;
    orderCount: number;
    totalQuantity: number;
}

/**
 * Get most bought stocks based on order volume
 */
export const getMostBoughtStocks = async (
    limit: number = 10
): Promise<MostBoughtStock[]> => {
    // Try to get from cache
    const cacheKey = 'stocks:most-bought';
    const cached = await getCache<MostBoughtStock[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Import Order model dynamically to avoid circular dependency
    const { Order } = await import('../models/Order.model');

    // Aggregate BUY orders
    const aggregation = await Order.aggregate([
        // Filter only BUY orders
        { $match: { side: 'BUY' } },
        // Group by symbol
        {
            $group: {
                _id: '$symbol',
                orderCount: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
            },
        },
        // Sort by order count (descending)
        { $sort: { orderCount: -1 } },
        // Limit results
        { $limit: limit },
    ]);

    // Enrich with stock details
    const results: MostBoughtStock[] = [];
    for (const item of aggregation) {
        const stock = await Stock.findOne({ symbol: item._id });
        if (stock) {
            results.push({
                symbol: stock.symbol,
                name: stock.name,
                currentPrice: stock.currentPrice,
                orderCount: item.orderCount,
                totalQuantity: item.totalQuantity,
            });
        }
    }

    // Cache the result
    await setCache(cacheKey, results, CACHE_TTL.STOCKS_LIST);

    return results;
};

export interface MarketMoverStock {
    symbol: string;
    name: string;
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
}

/**
 * Get top gaining stocks
 */
export const getTopGainers = async (
    limit: number = 10
): Promise<MarketMoverStock[]> => {
    // Try to get from cache
    const cacheKey = 'stocks:top-gainers';
    const cached = await getCache<MarketMoverStock[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Get all stocks
    const stocks = await Stock.find();

    // Calculate changes and filter gainers
    const gainers = stocks
        .map((stock) => {
            const change = stock.currentPrice - stock.previousClose;
            const changePercent = (change / stock.previousClose) * 100;
            return {
                symbol: stock.symbol,
                name: stock.name,
                currentPrice: stock.currentPrice,
                previousClose: stock.previousClose,
                change: parseFloat(change.toFixed(2)),
                changePercent: parseFloat(changePercent.toFixed(2)),
            };
        })
        .filter((stock) => stock.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, limit);

    // Cache the result
    await setCache(cacheKey, gainers, CACHE_TTL.STOCKS_LIST);

    return gainers;
};

/**
 * Get top losing stocks
 */
export const getTopLosers = async (
    limit: number = 10
): Promise<MarketMoverStock[]> => {
    // Try to get from cache
    const cacheKey = 'stocks:top-losers';
    const cached = await getCache<MarketMoverStock[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Get all stocks
    const stocks = await Stock.find();

    // Calculate changes and filter losers
    const losers = stocks
        .map((stock) => {
            const change = stock.currentPrice - stock.previousClose;
            const changePercent = (change / stock.previousClose) * 100;
            return {
                symbol: stock.symbol,
                name: stock.name,
                currentPrice: stock.currentPrice,
                previousClose: stock.previousClose,
                change: parseFloat(change.toFixed(2)),
                changePercent: parseFloat(changePercent.toFixed(2)),
            };
        })
        .filter((stock) => stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, limit);

    // Cache the result
    await setCache(cacheKey, losers, CACHE_TTL.STOCKS_LIST);

    return losers;
};

export interface VolumeShockerStock {
    symbol: string;
    name: string;
    currentPrice: number;
    totalVolume: number;
    orderCount: number;
}

/**
 * Get volume shockers (stocks with highest trading volume)
 */
export const getVolumeShockers = async (
    limit: number = 10
): Promise<VolumeShockerStock[]> => {
    // Try to get from cache
    const cacheKey = 'stocks:volume-shockers';
    const cached = await getCache<VolumeShockerStock[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Import Order model dynamically
    const { Order } = await import('../models/Order.model');

    // Aggregate all orders (BUY and SELL)
    const aggregation = await Order.aggregate([
        {
            $group: {
                _id: '$symbol',
                totalVolume: { $sum: '$quantity' },
                orderCount: { $sum: 1 },
            },
        },
        { $sort: { totalVolume: -1 } },
        { $limit: limit },
    ]);

    // Enrich with stock details
    const results: VolumeShockerStock[] = [];
    for (const item of aggregation) {
        const stock = await Stock.findOne({ symbol: item._id });
        if (stock) {
            results.push({
                symbol: stock.symbol,
                name: stock.name,
                currentPrice: stock.currentPrice,
                totalVolume: item.totalVolume,
                orderCount: item.orderCount,
            });
        }
    }

    // Cache the result
    await setCache(cacheKey, results, CACHE_TTL.STOCKS_LIST);

    return results;
};
