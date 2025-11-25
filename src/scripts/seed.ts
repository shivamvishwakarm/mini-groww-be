import { connectDB } from '../config/db';
import { Stock } from '../models/Stock.model';
import { logger } from '../utils/logger';

// Sample stock data
const stocksData = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'Technology',
        currentPrice: 178.25,
        previousClose: 176.80,
        marketCap: 2800000000000,
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        sector: 'Technology',
        currentPrice: 140.35,
        previousClose: 139.20,
        marketCap: 1750000000000,
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        sector: 'Technology',
        currentPrice: 378.90,
        previousClose: 375.50,
        marketCap: 2820000000000,
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        sector: 'Technology',
        currentPrice: 155.75,
        previousClose: 154.20,
        marketCap: 1600000000000,
    },

    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        sector: 'Automotive',
        currentPrice: 248.50,
        previousClose: 245.80,
        marketCap: 789000000000,
    },

];

/**
 * Seed database with stock data
 */
const seedStocks = async () => {
    try {
        logger.info('🌱 Starting database seed...');

        // Connect to database
        await connectDB();

        // Clear existing stocks
        await Stock.deleteMany({});
        logger.info('✅ Cleared existing stocks');

        // Insert new stocks
        await Stock.insertMany(stocksData);
        logger.info(`✅ Inserted ${stocksData.length} stocks`);

        logger.info('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedStocks();
