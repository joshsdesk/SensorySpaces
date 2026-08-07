const axios = require('axios');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const CommunityScraper = require('./CommunityScraper');
const { normalizeEvent, normalizeVenue } = require('../utils/dataNormalizer');
const inMemoryDb = require('../utils/inMemoryDb');

/**
 * Service to handle ingestion from external data sources.
 */
class IngestionService {
    constructor() {
        this.sources = {
            OPENWEB_NINJA: 'https://api.openwebninja.com/events',
            TICKETMASTER: 'https://app.ticketmaster.com/discovery/v2/events',
            PREDICT_HQ: 'https://api.predicthq.com/v1/events',
            EVENTBRITE: 'https://www.eventbriteapi.com/v3/events/search',
            DATA_GOV: 'https://catalog.data.gov/api/3/action/package_search',
            CO_MARKETPLACE: 'https://data.colorado.gov/api/views'
        };
    }

    /**
     * Polls OpenWeb Ninja for sensory-friendly events.
     * Note: In a real scenario, this would use a real API key from .env
     */
    async fetchOpenWebNinja(query = 'sensory friendly') {
        console.log(`[Ingestion] Fetching from OpenWeb Ninja: ${query}`);
        try {
            // Mocking the API response for now to demonstrate the flow
            // In reality: const response = await axios.get(`${this.sources.OPENWEB_NINJA}?q=${query}&apiKey=${process.env.OPENWEB_API_KEY}`);
            const mockData = [
                {
                    id: 'ext_123',
                    title: 'Quiet Morning at the Museum',
                    description: 'A dedicated sensory-friendly hour with dimmed lights and low noise.',
                    start_time: new Date().toISOString(),
                    location: 'Metropolitan Museum of Art',
                    latitude: 40.7794,
                    longitude: -73.9632
                },
                {
                    id: 'ext_124',
                    title: 'Relaxed Theater Performance: The Lion King',
                    description: 'A relaxed performance for families with ASD. No flashing lights.',
                    start_time: new Date(Date.now() + 86400000).toISOString(),
                    location: 'Minskoff Theatre',
                    latitude: 40.7580,
                    longitude: -73.9855
                }
            ];

            const normalizedEvents = mockData.map(item => normalizeEvent(item, 'openweb_ninja'));
            return await this.saveEvents(normalizedEvents);
        } catch (error) {
            console.error('[Ingestion] Error fetching OpenWeb Ninja:', error.message);
            return [];
        }
    }

    /**
     * Polls Ticketmaster for accessible events.
     */
    async fetchTicketmaster(query = 'sensory friendly') {
        console.log(`[Ingestion] Fetching from Ticketmaster: ${query}`);
        try {
            // Mocking Ticketmaster response
            const mockData = [
                {
                    id: 'tm_1',
                    name: 'Sensory Friendly Film: Disney Movie',
                    dates: { start: { localDate: new Date().toISOString() } },
                    _embedded: { venues: [{ name: 'AMC Theatres', address: { line1: '123 Movie Lane' } }] }
                }
            ];
            const normalizedEvents = mockData.map(item => normalizeEvent(item, 'ticketmaster'));
            return await this.saveEvents(normalizedEvents);
        } catch (error) {
            console.error('[Ingestion] Error fetching Ticketmaster:', error.message);
            return 0;
        }
    }

    /**
     * Polls PredictHQ for sensory-friendly events.
     */
    async fetchPredictHQ(query = 'sensory') {
        console.log(`[Ingestion] Fetching from PredictHQ: ${query}`);
        try {
            // Mocking PredictHQ response
            const mockData = [
                {
                    id: 'phq_1',
                    title: 'Community Sensory Garden Opening',
                    description: 'A quiet, outdoor event for nature lovers.',
                    start: new Date().toISOString(),
                    location: [40.7484, -73.9857], // [lat, lon]
                    address: 'Herald Square Park'
                }
            ];
            const normalizedEvents = mockData.map(item => normalizeEvent(item, 'predicthq'));
            return await this.saveEvents(normalizedEvents);
        } catch (error) {
            console.error('[Ingestion] Error fetching PredictHQ:', error.message);
            return 0;
        }
    }

    /**
     * Polls Eventbrite for local sensory-friendly events.
     */
    async fetchEventbrite(query = 'sensory') {
        console.log(`[Ingestion] Fetching from Eventbrite: ${query}`);
        try {
            // Mocking Eventbrite response
            const mockData = [
                {
                    id: 'eb_1',
                    name: { text: 'ASD Friendly Art Class' },
                    description: { text: 'A small group art session with adjustable lighting.' },
                    start: { utc: new Date().toISOString() },
                    venue: { address: { address_1: 'Art Studio 45' }, latitude: '40.7589', longitude: '-73.9851' }
                }
            ];
            const normalizedEvents = mockData.map(item => normalizeEvent(item, 'eventbrite'));
            return await this.saveEvents(normalizedEvents);
        } catch (error) {
            console.error('[Ingestion] Error fetching Eventbrite:', error.message);
            return 0;
        }
    }

    /**
     * Polls Data.gov for community datasets.
     */
    async fetchDataGov(query = 'recreation') {
        console.log(`[Ingestion] Searching Data.gov for: ${query}`);
        try {
            // In a real scenario, we'd call the CKAN API:
            // const response = await axios.get(`${this.sources.DATA_GOV}?q=${query}+colorado`);
            // For MVP, we simulate a few high-value results found in the catalog
            const mockData = [
                {
                    id: 'dg_1',
                    title: 'Denver Community Recreation Programs',
                    notes: 'Inclusive programs for youth and adults with disabilities.',
                    metadata_modified: new Date().toISOString(),
                    location: 'Denver, CO',
                    latitude: 39.7392,
                    longitude: -104.9903,
                    organization: { title: 'City of Denver' }
                }
            ];
            const normalizedEvents = mockData.map(item => normalizeEvent(item, 'data_gov'));
            return await this.saveEvents(normalizedEvents);
        } catch (error) {
            console.error('[Ingestion] Error fetching Data.gov:', error.message);
            return 0;
        }
    }

    /**
     * Polls Colorado Marketplace for permanent sensory-friendly spaces.
     */
    async fetchColoradoMarketplace() {
        console.log(`[Ingestion] Fetching permanent spaces from Colorado Marketplace...`);
        try {
            // Example of pulling from Socrata (data.colorado.gov)
            // Mocking a few permanent spaces (Libraries/Rec Centers)
            const mockData = [
                {
                    id: 'co_lib_1',
                    name: 'Denver Central Library',
                    description: 'Features a dedicated quiet zone and sensory-friendly storytime hours.',
                    type: 'Library',
                    address: '10 W 14th Ave Pkwy',
                    city: 'Denver',
                    zip: '80204',
                    latitude: 39.7379,
                    longitude: -104.9893,
                    website: 'https://www.denverlibrary.org'
                },
                {
                    id: 'co_rec_1',
                    name: 'Carla Madison Recreation Center',
                    description: 'Modern facility with inclusive sensory-friendly swimming hours.',
                    type: 'Recreation Center',
                    address: '2401 E Colfax Ave',
                    city: 'Denver',
                    zip: '80206',
                    latitude: 39.7402,
                    longitude: -104.9582,
                    website: 'https://www.denvergov.org'
                }
            ];

            const normalizedVenues = mockData.map(item => normalizeVenue(item, 'colorado_marketplace'));
            return await this.saveVenues(normalizedVenues);
        } catch (error) {
            console.error('[Ingestion] Error fetching Colorado Marketplace:', error.message);
            return 0;
        }
    }

    /**
     * Saves unique events to the database or in-memory fallback and returns the count of new ones.
     */
    async saveEvents(events) {
        let savedCount = 0;
        for (const eventData of events) {
            try {
                if (mongoose.connection && mongoose.connection.readyState === 1) {
                    const existing = await Event.findOne({
                        $or: [
                            { 'metadata.title': eventData.metadata?.title, 'metadata.date': eventData.metadata?.date },
                            { 'metadata.location.address': eventData.metadata?.location?.address, 'metadata.title': eventData.metadata?.title },
                            { 'metadata.externalId': eventData.metadata?.externalId }
                        ]
                    });

                    if (!existing) {
                        const newEvent = new Event(eventData);
                        await newEvent.save();
                        savedCount++;
                    }
                } else {
                    // Fallback to in-memory store when MongoDB is disconnected
                    inMemoryDb.addEvent({
                        title: eventData.metadata?.title,
                        description: eventData.metadata?.description,
                        date: eventData.metadata?.date,
                        location: eventData.metadata?.location,
                        organizer: eventData.metadata?.organizer,
                        sensoryProfile: eventData.sensoryProfile
                    });
                    savedCount++;
                }
            } catch (err) {
                console.error(`[Ingestion] Failed to save event: ${eventData.metadata?.title}`, err.message);
            }
        }
        return savedCount;
    }

    /**
     * Saves unique venues to the database or in-memory fallback and returns the count of new ones.
     */
    async saveVenues(venues) {
        let savedCount = 0;
        for (const venueData of venues) {
            try {
                if (mongoose.connection && mongoose.connection.readyState === 1) {
                    const existing = await Venue.findOne({
                        $or: [
                            { name: venueData.name, 'location.address': venueData.location?.address },
                            { externalId: venueData.externalId }
                        ]
                    });

                    if (!existing) {
                        const newVenue = new Venue(venueData);
                        await newVenue.save();
                        savedCount++;
                    }
                } else {
                    // Fallback to in-memory store when MongoDB is disconnected
                    inMemoryDb.addVenue(venueData);
                    savedCount++;
                }
            } catch (err) {
                console.error(`[Ingestion] Failed to save venue: ${venueData.name}`, err.message);
            }
        }
        return savedCount;
    }

    /**
     * Polls high-value community sites via scrapers.
     */
    async fetchCommunityEvents() {
        console.log(`[Ingestion] Running community scrapers...`);
        try {
            const rawEvents = await CommunityScraper.runAll();
            const normalizedEvents = rawEvents.map(item => normalizeEvent(item, 'community_scrape'));
            return await this.saveEvents(normalizedEvents);
        } catch (error) {
            console.error('[Ingestion] Error fetching community events:', error.message);
            return 0;
        }
    }

    /**
     * Orchestrates a full poll of all sources with a specific query.
     * Tiered Strategy: "Query + Denver (Beta)" -> "Query" -> "Nationwide Bridge"
     */
    async syncAll(searchQuery) {
        console.log(`[Ingestion] Starting real-time sync for: ${searchQuery}`);

        // If the query doesn't specify a city, we default to the Denver Beta context
        let enrichedQuery = searchQuery;
        if (!searchQuery.toLowerCase().includes('denver')) {
            enrichedQuery = `${searchQuery} denver`;
        }

        let totalCount = 0;

        // Priority 1: Denver Enrichment (Our Ground-Truth City)
        totalCount += await this.fetchOpenWebNinja(enrichedQuery);
        totalCount += await this.fetchDataGov('recreation denver');
        totalCount += await this.fetchColoradoMarketplace();
        totalCount += await this.fetchCommunityEvents();

        // Priority 2: Generic Nationwide Search (Google-like bridge)
        if (searchQuery !== enrichedQuery) {
            totalCount += await this.fetchOpenWebNinja(searchQuery);
        }

        // Tiered providers
        totalCount += await this.fetchTicketmaster(searchQuery);
        totalCount += await this.fetchPredictHQ(searchQuery);
        totalCount += await this.fetchEventbrite(searchQuery);

        return totalCount;
    }

    async pollAll() {
        // Daily background poll for common sensory terms in Denver
        return await this.syncAll('sensory friendly denver');
    }
}

module.exports = new IngestionService();
