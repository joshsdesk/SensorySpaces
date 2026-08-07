// server/src/config/venueBaselines.js
// MECHANISM 2: Venue Base Registry
// Version 1.0.0 - Denver Beta Focus

const VENUE_BASELINES = {
    // LIBRARIES = Generally Quiet
    'Denver Public Library': {
        defaults: {
            noiseLevel: 'Low',
            lighting: 'Natural',
            crowdDensity: 'Low'
        },
        meta: {
            version: 1,
            lastVerified: '2026-01-14',
            source: 'admin_ground_truth',
            confidence: 0.8
        }
    },

    // MUSEUMS = Variable (Default to Medium)
    'Children\'s Museum of Denver': {
        defaults: {
            noiseLevel: 'High', // Default is loud unless specific event
            lighting: 'Bright',
            crowdDensity: 'High'
        },
        meta: {
            version: 1,
            lastVerified: '2026-01-14',
            source: 'admin_ground_truth',
            confidence: 0.7
        }
    },

    // OUTDOOR / NATURE
    'Denver Botanic Gardens': {
        defaults: {
            noiseLevel: 'Low',
            lighting: 'Natural',
            crowdDensity: 'Medium'
        },
        meta: {
            version: 1,
            lastVerified: '2026-01-14',
            source: 'admin_ground_truth',
            confidence: 0.85
        }
    },

    // SENSORY SPECIFIC VENUES
    'Red Rocks Amphitheatre': {
        defaults: {
            noiseLevel: 'High',
            lighting: 'Bright',
            crowdDensity: 'High'
        },
        meta: {
            version: 1,
            lastVerified: '2026-01-14',
            source: 'admin_ground_truth',
            confidence: 0.9
        }
    }
};

module.exports = VENUE_BASELINES;
