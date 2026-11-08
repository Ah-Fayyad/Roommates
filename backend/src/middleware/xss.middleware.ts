import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

/**
 * Recursively sanitize an object, array, or string to prevent Cross-Site Scripting (XSS).
 */
const clean = (data: any): any => {
    if (data === null || typeof data === 'undefined') {
        return data;
    }
    
    if (typeof data === 'string') {
        // Run the robust XSS filter against the string
        return xss(data.trim());
    }
    
    if (Array.isArray(data)) {
        return data.map((item) => clean(item));
    }
    
    // Check if it's a plain JavaScript object
    if (typeof data === 'object' && !Buffer.isBuffer(data) && !(data instanceof Date)) {
        let cleaned: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                cleaned[key] = clean(data[key]);
            }
        }
        return cleaned;
    }
    
    // Return booleans, numbers, Dates, Buffers as is
    return data;
};

/**
 * Express middleware to sanitize incoming data (body, query, params)
 */
export const xssSanitize = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.body) req.body = clean(req.body);
        if (req.query) req.query = clean(req.query);
        if (req.params) req.params = clean(req.params);
        next();
    };
};
