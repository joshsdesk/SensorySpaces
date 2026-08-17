const jwt = require('jsonwebtoken');
const authMiddleware = require('../authMiddleware');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    test('should return 401 if no Authorization header is present', async () => {
        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if Authorization header does not start with Bearer', async () => {
        req.headers.authorization = 'Basic 12345';

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 for invalid JWT token', async () => {
        req.headers.authorization = 'Bearer invalid_token';

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should attach user and call next() for valid JWT token', async () => {
        const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const token = jwt.sign({ userId: 'usr_test_123' }, secret);
        req.headers.authorization = `Bearer ${token}`;

        await authMiddleware(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user._id).toBe('usr_test_123');
        expect(next).toHaveBeenCalled();
    });
});
