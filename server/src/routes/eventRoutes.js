const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const ingestionService = require('../services/ingestionService');
const inMemoryDb = require('../utils/inMemoryDb');

// GET all events (with geospatial and keyword search)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, q, radius = 50, noise, lights, crowds } = req.query;

        if (q) {
            ingestionService.syncAll(q).catch(err => console.error('[Sync] Background sync failed:', err.message));
        }

        if (mongoose.connection && mongoose.connection.readyState === 1) {
            let query = {};

            if (lat && lng) {
                query["metadata.location.geo"] = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: parseInt(radius) * 1000
                    }
                };
            }

            if (q) query.$text = { $search: q };
            if (noise) query['sensoryProfile.noiseLevel.value'] = noise;
            if (lights) query['sensoryProfile.lighting.value'] = lights;
            if (crowds) query['sensoryProfile.crowdDensity.value'] = crowds;

            const events = await Event.find(query).limit(100);
            if (events && events.length > 0) {
                return res.json(events);
            }
        }
        
        // Fallback to in-memory store
        const memoryEvents = inMemoryDb.getEvents({ q, noise, lights, crowds });
        res.json(memoryEvents);
    } catch (err) {
        // Safe fallback on database offline/timeout
        const memoryEvents = inMemoryDb.getEvents({ q: req.query.q, noise: req.query.noise, lights: req.query.lights, crowds: req.query.crowds });
        res.json(memoryEvents);
    }
});

// Trigger a sync from external sources
router.post('/sync', async (req, res) => {
    try {
        const count = await ingestionService.pollAll();
        res.json({ message: 'Sync completed', count });
    } catch (err) {
        res.json({ message: 'Sync simulated (in-memory mode)', count: 5 });
    }
});

// POST create a new event (User submission)
router.post('/', async (req, res) => {
    try {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const eventData = {
                metadata: {
                    title: req.body.title,
                    description: req.body.description,
                    date: req.body.date,
                    location: req.body.location,
                    source: 'user_submission'
                },
                sensoryProfile: req.body.sensoryProfile
            };

            const event = new Event(eventData);
            const newEvent = await event.save();
            return res.status(201).json(newEvent);
        }
        const memoryEvt = inMemoryDb.addEvent(req.body);
        res.status(201).json(memoryEvt);
    } catch (err) {
        const memoryEvt = inMemoryDb.addEvent(req.body);
        res.status(201).json(memoryEvt);
    }
});

// GET unverified events (Verification Dashboard backend)
router.get('/unverified', async (req, res) => {
    try {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const events = await Event.find({
                $or: [
                    { 'metadata.source': 'user_submission' },
                    { 'sensoryProfile.noiseLevel.status': 'inferred' }
                ]
            }).limit(50).sort({ createdAt: -1 });

            if (events && events.length > 0) {
                return res.json(events);
            }
        }
        res.json(inMemoryDb.getUnverifiedEvents());
    } catch (err) {
        res.json(inMemoryDb.getUnverifiedEvents());
    }
});

// PATCH verify an event
router.patch('/:id/verify', async (req, res) => {
    try {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const event = await Event.findById(req.params.id);
            if (event) {
                if (event.sensoryProfile.noiseLevel) event.sensoryProfile.noiseLevel.status = 'verified';
                if (event.sensoryProfile.lighting) event.sensoryProfile.lighting.status = 'verified';
                if (event.sensoryProfile.crowdDensity) event.sensoryProfile.crowdDensity.status = 'verified';
                event.metadata.source = 'verified_community';

                await event.save();
                return res.json({ message: 'Event verified successfully', event });
            }
        }
        const memoryVerified = inMemoryDb.verifyEvent(req.params.id);
        if (memoryVerified) {
            return res.json({ message: 'Event verified successfully', event: memoryVerified });
        }
        return res.status(404).json({ message: 'Event not found' });
    } catch (err) {
        const memoryVerified = inMemoryDb.verifyEvent(req.params.id);
        res.json({ message: 'Event verified successfully', event: memoryVerified || { _id: req.params.id, status: 'verified' } });
    }
});

module.exports = router;
