import { connectDB } from '../config/db';
import { Stock } from '../models/Stock.model';
import { logger } from '../utils/logger';

// Sample stock data
const stocksData = [
    // Technology
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
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        sector: 'Technology',
        currentPrice: 485.60,
        previousClose: 482.30,
        marketCap: 1240000000000,
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        sector: 'Technology',
        currentPrice: 495.20,
        previousClose: 488.75,
        marketCap: 1220000000000,
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        sector: 'Automotive',
        currentPrice: 248.50,
        previousClose: 245.80,
        marketCap: 789000000000,
    },
    {
        symbol: 'NFLX',
        name: 'Netflix Inc.',
        sector: 'Entertainment',
        currentPrice: 485.30,
        previousClose: 480.90,
        marketCap: 210000000000,
    },
    {
        symbol: 'AMD',
        name: 'Advanced Micro Devices',
        sector: 'Technology',
        currentPrice: 165.40,
        previousClose: 162.80,
        marketCap: 267000000000,
    },
    {
        symbol: 'INTC',
        name: 'Intel Corporation',
        sector: 'Technology',
        currentPrice: 43.25,
        previousClose: 42.90,
        marketCap: 182000000000,
    },

    // Finance
    {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        sector: 'Finance',
        currentPrice: 178.45,
        previousClose: 176.20,
        marketCap: 518000000000,
    },
    {
        symbol: 'BAC',
        name: 'Bank of America Corp.',
        sector: 'Finance',
        currentPrice: 34.80,
        previousClose: 34.50,
        marketCap: 275000000000,
    },
    {
        symbol: 'V',
        name: 'Visa Inc.',
        sector: 'Finance',
        currentPrice: 275.90,
        previousClose: 273.40,
        marketCap: 570000000000,
    },
    {
        symbol: 'MA',
        name: 'Mastercard Inc.',
        sector: 'Finance',
        currentPrice: 445.60,
        previousClose: 442.30,
        marketCap: 425000000000,
    },

    // Healthcare
    {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        sector: 'Healthcare',
        currentPrice: 158.75,
        previousClose: 157.90,
        marketCap: 385000000000,
    },
    {
        symbol: 'UNH',
        name: 'UnitedHealth Group',
        sector: 'Healthcare',
        currentPrice: 528.40,
        previousClose: 525.80,
        marketCap: 495000000000,
    },
    {
        symbol: 'PFE',
        name: 'Pfizer Inc.',
        sector: 'Healthcare',
        currentPrice: 28.65,
        previousClose: 28.40,
        marketCap: 161000000000,
    },

    // Consumer
    {
        symbol: 'KO',
        name: 'The Coca-Cola Company',
        sector: 'Consumer Goods',
        currentPrice: 61.25,
        previousClose: 60.90,
        marketCap: 265000000000,
    },
    {
        symbol: 'PEP',
        name: 'PepsiCo Inc.',
        sector: 'Consumer Goods',
        currentPrice: 172.80,
        previousClose: 171.50,
        marketCap: 238000000000,
    },
    {
        symbol: 'WMT',
        name: 'Walmart Inc.',
        sector: 'Retail',
        currentPrice: 168.90,
        previousClose: 167.40,
        marketCap: 455000000000,
    },
    {
        symbol: 'DIS',
        name: 'The Walt Disney Company',
        sector: 'Entertainment',
        currentPrice: 98.75,
        previousClose: 97.80,
        marketCap: 180000000000,
    },

    // Energy
    {
        symbol: 'XOM',
        name: 'Exxon Mobil Corporation',
        sector: 'Energy',
        currentPrice: 108.45,
        previousClose: 107.20,
        marketCap: 445000000000,
    },
    {
        symbol: 'CVX',
        name: 'Chevron Corporation',
        sector: 'Energy',
        currentPrice: 158.30,
        previousClose: 156.90,
        marketCap: 295000000000,
    },

    // Communication
    {
        symbol: 'T',
        name: 'AT&T Inc.',
        sector: 'Telecommunications',
        currentPrice: 18.45,
        previousClose: 18.30,
        marketCap: 132000000000,
    },
    {
        symbol: 'VZ',
        name: 'Verizon Communications',
        sector: 'Telecommunications',
        currentPrice: 40.25,
        previousClose: 40.10,
        marketCap: 169000000000,
    },

    // Industrial
    {
        symbol: 'BA',
        name: 'The Boeing Company',
        sector: 'Aerospace',
        currentPrice: 178.90,
        previousClose: 176.50,
        marketCap: 110000000000,
    },
    {
        symbol: 'CAT',
        name: 'Caterpillar Inc.',
        sector: 'Industrial',
        currentPrice: 325.60,
        previousClose: 322.80,
        marketCap: 168000000000,
    },

    // Retail & E-commerce
    {
        symbol: 'HD',
        name: 'The Home Depot',
        sector: 'Retail',
        currentPrice: 358.75,
        previousClose: 356.20,
        marketCap: 365000000000,
    },
    {
        symbol: 'NKE',
        name: 'Nike Inc.',
        sector: 'Consumer Goods',
        currentPrice: 98.40,
        previousClose: 97.60,
        marketCap: 152000000000,
    },

    // Semiconductors
    {
        symbol: 'QCOM',
        name: 'Qualcomm Inc.',
        sector: 'Technology',
        currentPrice: 168.90,
        previousClose: 166.50,
        marketCap: 188000000000,
    },
    {
        symbol: 'TXN',
        name: 'Texas Instruments',
        sector: 'Technology',
        currentPrice: 178.25,
        previousClose: 176.80,
        marketCap: 162000000000,
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
