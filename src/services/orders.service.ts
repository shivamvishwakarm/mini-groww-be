import { Order, IOrder, OrderSide } from '../models/Order.model';
import { Holding } from '../models/Holding.model';
import { User } from '../models/User.model';
import { Stock } from '../models/Stock.model';

export interface CreateOrderInput {
    userId: string;
    symbol: string;
    side: OrderSide;
    quantity: number;
}

/**
 * Create a new order (BUY or SELL)
 * Note: For development without replica set, transactions are disabled
 */
export const createOrder = async (
    input: CreateOrderInput
): Promise<IOrder> => {
    const { userId, symbol, side, quantity } = input;
    const upperSymbol = symbol.toUpperCase();

    // Get stock
    const stock = await Stock.findOne({ symbol: upperSymbol });
    if (!stock) {
        throw new Error('Stock not found');
    }

    const price = stock.currentPrice;
    const totalCost = price * quantity;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (side === 'BUY') {
        // Check if user has enough balance
        if (user.balance < totalCost) {
            throw new Error('Insufficient balance');
        }

        // Deduct balance
        user.balance -= totalCost;
        await user.save();

        // Update or create holding
        const holding = await Holding.findOne({
            userId,
            symbol: upperSymbol,
        });

        if (holding) {
            // Update existing holding
            const totalQuantity = holding.quantity + quantity;
            const totalValue = holding.avgBuyPrice * holding.quantity + totalCost;
            holding.avgBuyPrice = totalValue / totalQuantity;
            holding.quantity = totalQuantity;
            await holding.save();
        } else {
            // Create new holding
            await Holding.create({
                userId,
                symbol: upperSymbol,
                quantity,
                avgBuyPrice: price,
            });
        }
    } else {
        // SELL
        // Check if user has enough holdings
        const holding = await Holding.findOne({
            userId,
            symbol: upperSymbol,
        });

        if (!holding || holding.quantity < quantity) {
            throw new Error('Insufficient holdings');
        }

        // Add balance
        user.balance += totalCost;
        await user.save();

        // Update or delete holding
        if (holding.quantity === quantity) {
            // Delete holding if selling all
            await Holding.deleteOne({ _id: holding._id });
        } else {
            // Update holding
            holding.quantity -= quantity;
            await holding.save();
        }
    }

    // Create order record
    const order = await Order.create({
        userId,
        symbol: upperSymbol,
        side,
        quantity,
        price,
    });

    return order;
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
    return Order.find({ userId }).sort({ createdAt: -1 });
};
