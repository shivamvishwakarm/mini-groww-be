import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User.model';
import { generateToken } from '../utils/jwt';
import { config } from '../config/env';

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        balance: number;
    };
    token: string;
}

/**
 * Register a new user
 */
export const register = async (
    input: RegisterInput
): Promise<AuthResponse> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, 10);

    // Create user with initial balance
    const user = await User.create({
        name: input.name,
        email: input.email,
        passwordHash,
        balance: config.initialBalance,
    });

    // Generate token
    const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
    });

    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            balance: user.balance,
        },
        token,
    };
};

/**
 * Login user
 */
export const login = async (input: LoginInput): Promise<AuthResponse> => {
    // Find user
    const user = await User.findOne({ email: input.email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
        input.password,
        user.passwordHash
    );
    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
    });

    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            balance: user.balance,
        },
        token,
    };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId);
};
