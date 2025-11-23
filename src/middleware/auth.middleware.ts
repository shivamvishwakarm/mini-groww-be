import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'No token provided', 401);
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = verifyToken(token);

        // Attach user to request
        req.user = payload;

        next();
    } catch (error) {
        sendError(res, 'Invalid or expired token', 401);
    }
};
