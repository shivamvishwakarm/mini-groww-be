import { connectDB } from '../config/db';
import { Stock } from '../models/Stock.model';
import { Index } from '../models/Index.model';
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

// Indian market indices data
const indicesData = [
    {
        symbol: 'NIFTY',
        name: 'NIFTY 50',
        currentValue: 22150.50,
        previousClose: 22100.00,
    },
    {
        symbol: 'SENSEX',
        name: 'BSE SENSEX',
        currentValue: 72850.75,
        previousClose: 72700.00,
    },
    {
        symbol: 'BANKNIFTY',
        name: 'NIFTY BANK',
        currentValue: 48250.30,
        previousClose: 48100.00,
    },
    {
        symbol: 'MIDCAPNIFTY',
        name: 'NIFTY MIDCAP 50',
        currentValue: 12450.80,
        previousClose: 12400.00,
    },
    {
        symbol: 'FINNIFTY',
        name: 'NIFTY FINANCIAL SERVICES',
        currentValue: 20350.60,
        previousClose: 20300.00,
    },
];

/**
 * Seed database with stock and index data
 */
const seedDatabase = async () => {
    try {
        logger.info('🌱 Starting database seed...');

        // Connect to database
        await connectDB();

        // Clear existing data
        await Stock.deleteMany({});
        await Index.deleteMany({});
        logger.info('✅ Cleared existing data');

        // Insert stocks
        await Stock.insertMany(stocksData);
        logger.info(`✅ Inserted ${stocksData.length} stocks`);

        // Insert indices
        await Index.insertMany(indicesData);
        logger.info(`✅ Inserted ${indicesData.length} indices`);

        logger.info('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
