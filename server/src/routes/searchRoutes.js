const express = require('express');
const router = express.Router();
const autocompleteService = require('../services/autocompleteService');

/**
 * Get autocomplete suggestions
 * GET /api/search/autocomplete?q=sensory
 */
router.get('/autocomplete', (req, res) => {
    try {
        const { q, limit = 5 } = req.query;

        if (!q) {
            // Return popular searches if no query
            const popular = autocompleteService.getPopularSearches();
            return res.json({
                suggestions: popular.map(text => ({ text, type: 'popular' })),
                query: ''
            });
        }

        const suggestions = autocompleteService.getSuggestions(q, parseInt(limit));

        res.json({
            suggestions,
            query: q
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Normalize search query (for backend processing)
 * POST /api/search/normalize
 */
router.post('/normalize', (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const normalized = autocompleteService.normalizeSearchQuery(query);

        res.json(normalized);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Get popular searches (for empty state)
 * GET /api/search/popular
 */
router.get('/popular', (req, res) => {
    try {
        const popular = autocompleteService.getPopularSearches();
        res.json({ searches: popular });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
