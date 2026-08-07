const searchTaxonomy = require('../config/searchTaxonomy.json');

/**
 * Autocomplete Service
 * Provides intelligent search suggestions based on user input
 */
class AutocompleteService {
    constructor() {
        this.suggestions = searchTaxonomy.autocomplete;
        this.allPhrases = [
            ...searchTaxonomy.searchPhrases.core,
            ...searchTaxonomy.searchPhrases.activityBased,
            ...searchTaxonomy.searchPhrases.awarenessEvents
        ];
    }

    /**
     * Get autocomplete suggestions based on user input
     * @param {string} query - User's partial search query
     * @param {number} limit - Max number of suggestions (default: 5)
     * @returns {Array} Array of suggestion objects
     */
    getSuggestions(query, limit = 5) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        const results = [];

        // 1. Check for exact trigger matches
        const triggerMatch = this.suggestions.find(item =>
            normalizedQuery.startsWith(item.trigger)
        );

        if (triggerMatch) {
            results.push(...triggerMatch.suggestions.map(text => ({
                text,
                type: 'triggered',
                trigger: triggerMatch.trigger,
                icon: this._getIconForTrigger(triggerMatch.trigger)
            })));
        }

        // 2. Fuzzy match across all known phrases
        const fuzzyMatches = this.allPhrases
            .filter(phrase => phrase.toLowerCase().includes(normalizedQuery))
            .filter(phrase => !results.some(r => r.text === phrase)) // Avoid duplicates
            .map(text => ({
                text,
                type: 'fuzzy',
                relevance: this._calculateRelevance(normalizedQuery, text)
            }))
            .sort((a, b) => b.relevance - a.relevance);

        results.push(...fuzzyMatches);

        // 3. Limit and return
        return results.slice(0, limit);
    }

    /**
     * Calculate relevance score for fuzzy matching
     * @private
     */
    _calculateRelevance(query, phrase) {
        const lowerPhrase = phrase.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // Exact match
        if (lowerPhrase === lowerQuery) return 100;

        // Starts with query
        if (lowerPhrase.startsWith(lowerQuery)) return 90;

        // Word boundary match
        const words = lowerPhrase.split(' ');
        if (words.some(word => word.startsWith(lowerQuery))) return 70;

        // Contains query
        if (lowerPhrase.includes(lowerQuery)) return 50;

        return 0;
    }

    /**
     * Get icon for trigger type
     * @private
     */
    _getIconForTrigger(trigger) {
        const iconMap = {
            'sensory': '🎧',
            'quiet': '🤫',
            'museum': '🏛️',
            'family': '👨‍👩‍👧',
            'nature': '🌳',
            'craft': '🎨',
            'support': '🤝'
        };
        return iconMap[trigger] || '🔍';
    }

    /**
     * Get popular searches (for empty state)
     * @returns {Array} Top search phrases
     */
    getPopularSearches() {
        return [
            'sensory-friendly events',
            'quiet hours for families',
            'museum sensory hours',
            'autism friendly activities',
            'therapeutic play events'
        ];
    }

    /**
     * Normalize search query by mapping to canonical tags
     * @param {string} query - User's search query
     * @returns {Object} Normalized search with canonical tags
     */
    normalizeSearchQuery(query) {
        const normalizedQuery = query.toLowerCase();
        const matchedTags = new Set();
        const synonymMap = searchTaxonomy.synonymMapping;

        // Check against synonym mapping
        Object.entries(synonymMap).forEach(([canonicalTag, synonyms]) => {
            if (synonyms.some(synonym => normalizedQuery.includes(synonym.toLowerCase()))) {
                matchedTags.add(canonicalTag);
            }
        });

        return {
            originalQuery: query,
            canonicalTags: Array.from(matchedTags),
            normalizedQuery
        };
    }
}

module.exports = new AutocompleteService();
