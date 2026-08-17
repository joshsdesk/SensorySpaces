const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Validates JWT Bearer tokens and attaches the authenticated user to req.user.
 * Rejects unauthenticated or invalid token requests with 401 Unauthorized.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-in-production'
        );

        if (mongoose.connection && mongoose.connection.readyState === 1) {
            try {
                const user = await User.findById(decoded.userId);
                if (user && user.isActive) {
                    req.user = user;
                    return next();
                } else if (user && !user.isActive) {
                    return res.status(403).json({ message: 'Account is deactivated.' });
                }
            } catch (dbErr) {
                // Database query error fallback
            }
        }

        if (!decoded.userId) {
            return res.status(401).json({ message: 'Invalid token payload.' });
        }

        req.user = { _id: decoded.userId, email: decoded.email || 'user@example.com', isActive: true };
        return next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
