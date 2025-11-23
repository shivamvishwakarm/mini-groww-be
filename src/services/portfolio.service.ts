import { Holding } from '../models/Holding.model';
import { Stock } from '../models/Stock.model';
import { User } from '../models/User.model';

export interface HoldingWithValue {
    symbol: string;
    quantity: number;
    avgBuyPrice: number;
    currentPrice: number;
    currentValue: number;
    investedValue: number;
    profitLoss: number;
    profitLossPercent: number;
}

export interface PortfolioSummary {
    holdings: HoldingWithValue[];
    totalInvestedValue: number;
    totalCurrentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
    availableBalance: number;
    totalPortfolioValue: number;
}

/**
 * Get user's portfolio with current values and P&L
 */
export const getUserPortfolio = async (
    userId: string
): Promise<PortfolioSummary> => {
    // Get user's holdings
    const holdings = await Holding.find({ userId });

    // Get user's balance
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const holdingsWithValue: HoldingWithValue[] = [];
    let totalInvestedValue = 0;
    let totalCurrentValue = 0;

    // Calculate values for each holding
    for (const holding of holdings) {
        // Get current stock price
        const stock = await Stock.findOne({ symbol: holding.symbol });
        if (!stock) {
            continue; // Skip if stock not found
        }

        const investedValue = holding.avgBuyPrice * holding.quantity;
        const currentValue = stock.currentPrice * holding.quantity;
        const profitLoss = currentValue - investedValue;
        const profitLossPercent = (profitLoss / investedValue) * 100;

        holdingsWithValue.push({
            symbol: holding.symbol,
            quantity: holding.quantity,
            avgBuyPrice: holding.avgBuyPrice,
            currentPrice: stock.currentPrice,
            currentValue,
            investedValue,
            profitLoss,
            profitLossPercent,
        });

        totalInvestedValue += investedValue;
        totalCurrentValue += currentValue;
    }

    const totalProfitLoss = totalCurrentValue - totalInvestedValue;
    const totalProfitLossPercent =
        totalInvestedValue > 0 ? (totalProfitLoss / totalInvestedValue) * 100 : 0;

    return {
        holdings: holdingsWithValue,
        totalInvestedValue,
        totalCurrentValue,
        totalProfitLoss,
        totalProfitLossPercent,
        availableBalance: user.balance,
        totalPortfolioValue: user.balance + totalCurrentValue,
    };
};
