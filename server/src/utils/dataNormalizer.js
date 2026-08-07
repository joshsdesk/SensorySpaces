/**
 * Utility to normalize external data sources into the SensorySpaces Event schema.
 * Updated 2026-01-14: Sensory-First Architecture (Layer A/B)
 */

const InferenceEngine = require('../services/SensoryInferenceEngine');

/**
 * Normalizes an event from external APIs.
 * @param {Object} rawData - The raw event data from an external source.
 * @param {string} source - 'data.gov', 'openweb_ninja', etc.
 */
exports.normalizeEvent = (rawData, source) => {
    // 1. Extract Layer A (Metadata)
    const metadata = {
        title: '',
        description: '',
        date: new Date(),
        location: {
            address: '',
            geo: { type: 'Point', coordinates: [0, 0] }
        },
        venue: null, // To be resolved to ObjectId if possible
        organizer: '',
        source: source,
        externalId: ''
    };

    let venueNameCandidate = '';

    if (source === 'openweb_ninja') {
        metadata.title = rawData.title;
        metadata.description = rawData.description || '';
        metadata.date = new Date(rawData.start_time || Date.now());
        metadata.location.address = rawData.location || 'Unknown Location';
        metadata.location.geo.coordinates = [
            parseFloat(rawData.longitude) || -104.9903,
            parseFloat(rawData.latitude) || 39.7392
        ];
        metadata.externalId = rawData.id;
        venueNameCandidate = rawData.location; // Often contains venue name
    } else if (source === 'ticketmaster') {
        metadata.title = rawData.name;
        metadata.description = rawData.description || '';
        metadata.date = new Date(rawData.dates?.start?.localDate || Date.now());
        const venue = rawData._embedded?.venues?.[0];
        metadata.location.address = venue?.name || 'Unknown Venue';
        metadata.location.geo.coordinates = [
            parseFloat(venue?.location?.longitude) || -104.9903,
            parseFloat(venue?.location?.latitude) || 39.7392
        ];
        metadata.externalId = rawData.id;
        venueNameCandidate = venue?.name;
    } else if (source === 'predicthq') {
        metadata.title = rawData.title;
        metadata.description = rawData.description || '';
        metadata.date = new Date(rawData.start || Date.now());
        metadata.location.address = rawData.address || 'Unknown Address';
        metadata.location.geo.coordinates = [
            parseFloat(rawData.location?.[1]) || -104.9903, // PredictHQ is often [lat, lon]
            parseFloat(rawData.location?.[0]) || 39.7392
        ];
        metadata.externalId = rawData.id;
        venueNameCandidate = rawData.entities?.[0]?.name || rawData.address;
    } else if (source === 'eventbrite') {
        metadata.title = rawData.name?.text || '';
        metadata.description = rawData.description?.text || '';
        metadata.date = new Date(rawData.start?.utc || Date.now());
        metadata.location.address = rawData.venue?.address?.address_1 || 'Unknown Venue';
        metadata.location.geo.coordinates = [
            parseFloat(rawData.venue?.longitude) || -104.9903,
            parseFloat(rawData.venue?.latitude) || 39.7392
        ];
        metadata.externalId = rawData.id;
        venueNameCandidate = rawData.venue?.name;
    } else if (source === 'data_gov') {
        metadata.title = rawData.title || rawData.name;
        metadata.description = rawData.notes || '';
        metadata.date = new Date(rawData.metadata_modified || Date.now());
        metadata.location.address = rawData.location || 'Colorado';
        metadata.location.geo.coordinates = [
            parseFloat(rawData.longitude) || -104.9903,
            parseFloat(rawData.latitude) || 39.7392
        ];
        metadata.externalId = rawData.id;
        venueNameCandidate = rawData.organization?.title || '';
    } else if (source === 'colorado_marketplace') {
        metadata.title = rawData.name || rawData.title || 'Colorado Listing';
        metadata.description = rawData.description || '';
        metadata.date = new Date();
        metadata.location.address = rawData.address || rawData.location || 'Colorado';
        metadata.location.geo.coordinates = [
            parseFloat(rawData.longitude) || -104.9903,
            parseFloat(rawData.latitude) || 39.7392
        ];
        metadata.externalId = rawData.id || rawData.externalId;
        venueNameCandidate = rawData.venue_name || '';
    } else if (source === 'community_scrape') {
        metadata.title = rawData.title || '';
        metadata.description = rawData.description || '';
        metadata.date = new Date(rawData.date || Date.now());
        metadata.location.address = rawData.location || '';
        metadata.location.geo.coordinates = rawData.coordinates || [-104.9903, 39.7392];
        metadata.externalId = rawData.id;
        venueNameCandidate = rawData.location || '';
    }

    // 2. Run Mechanism 1: Sensory Inference Engine
    const inferenceInput = {
        title: metadata.title,
        description: metadata.description,
        venueName: venueNameCandidate,
        date: metadata.date
    };

    const inferenceResult = InferenceEngine.infer(inferenceInput);

    // 3. Construct Final Layer A/B Object
    return {
        metadata: metadata,
        sensoryProfile: inferenceResult.profile,
        inference: {
            version: inferenceResult.version,
            lastInferredAt: new Date(),
            history: []
        },
        legacyTags: [] // Preserve if migrating old data
    };
};

/**
 * Normalizes a venue from external datasets.
 */
exports.normalizeVenue = (rawData, source) => {
    const venue = {
        name: '',
        description: '',
        type: 'Other',
        location: {
            address: '',
            city: '',
            state: 'CO',
            zip: '',
            geo: { type: 'Point', coordinates: [-104.9903, 39.7392] }
        },
        contact: {
            phone: '',
            email: '',
            website: ''
        },
        sensoryDefaults: {
            noiseLevel: 'Moderate',
            lighting: 'Natural',
            crowdDensity: 'Medium'
        },
        features: [],
        externalId: '',
        source: source
    };

    if (source === 'colorado_marketplace') {
        venue.name = rawData.name || rawData.library_name || rawData.facility_name;
        venue.description = rawData.description || '';
        venue.type = rawData.type || 'Other';
        venue.location.address = rawData.address || '';
        venue.location.city = rawData.city || '';
        venue.location.zip = rawData.zip || '';
        venue.location.geo.coordinates = [
            parseFloat(rawData.longitude) || -104.9903,
            parseFloat(rawData.latitude) || 39.7392
        ];
        venue.externalId = rawData.id || rawData.externalId;
        venue.contact.website = rawData.website || '';
    }

    return venue;
};
