import { Index } from '../models/Index.model';
import { getCache, setCache } from '../config/redis';

// Cache TTLs (in seconds)
const CACHE_TTL = {
    INDICES_LIST: 60,
    INDEX_DETAIL: 60,
};

// Cache key patterns
const CACHE_KEYS = {
    INDICES_LIST: 'indices:list',
    INDEX_DETAIL: (symbol: string) => `indices:detail:${symbol}`,
};

export interface IndexWithChange {
    symbol: string;
    name: string;
    currentValue: number;
    previousClose: number;
    change: number;
    changePercent: number;
}

/**
 * Get all indices with Redis caching
 */
export const getAllIndices = async (): Promise<IndexWithChange[]> => {
    // Try to get from cache
    const cached = await getCache<IndexWithChange[]>(CACHE_KEYS.INDICES_LIST);
    if (cached) {
        return cached;
    }

    // Get from database
    const indices = await Index.find().sort({ symbol: 1 });

    // Calculate changes
    const indicesWithChange = indices.map((index) => {
        const change = index.currentValue - index.previousClose;
        const changePercent = (change / index.previousClose) * 100;
        return {
            ...index.toObject(),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
        };
    });

    // Cache the result
    await setCache(CACHE_KEYS.INDICES_LIST, indicesWithChange, CACHE_TTL.INDICES_LIST);

    return indicesWithChange;
};

/**
 * Get index by symbol with Redis caching
 */
export const getIndexBySymbol = async (
    symbol: string
): Promise<IndexWithChange | null> => {
    const upperSymbol = symbol.toUpperCase();

    // Try to get from cache
    const cacheKey = CACHE_KEYS.INDEX_DETAIL(upperSymbol);
    const cached = await getCache<IndexWithChange>(cacheKey);
    if (cached) {
        return cached;
    }

    // Get from database
    const index = await Index.findOne({ symbol: upperSymbol });

    if (!index) {
        return null;
    }

    // Calculate changes
    const change = index.currentValue - index.previousClose;
    const changePercent = (change / index.previousClose) * 100;
    const indexWithChange = {
        ...index.toObject(),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
    };

    // Cache the result
    await setCache(cacheKey, indexWithChange, CACHE_TTL.INDEX_DETAIL);

    return indexWithChange;
};
