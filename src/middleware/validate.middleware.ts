import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

/**
 * Middleware to validate request data using Zod schemas
 */
export const validate = (schema: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validate body
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }

            // Validate query
            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }

            // Validate params
            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                sendError(res, 'Validation failed', 400, errors);
            } else {
                sendError(res, 'Validation error', 400);
            }
        }
    };
};
